import { postS2SLease } from '../../services/service-auth-provider-api/service-auth-provider-api';
import * as jwtDecode from 'jwt-decode';
import { config } from '../../../config';

const cache = {};
const microservice = config.microservice;

function validateCache() {
    const currentTime = Math.floor(Date.now() / 1000);
    if (!cache[microservice]) return false;
    return currentTime < cache[microservice].expiresAt;
}

function getToken() {
    return cache[microservice];
}

async function generateToken() {
    const body = await postS2SLease();
    const tokenData = jwtDecode(body);

    cache[microservice] = {
        expiresAt: tokenData.exp,
        token: body
    };
}

async function serviceTokenGenerator() {
    if (!validateCache()) {
        await generateToken();
    }

    return getToken();
}

export async function serviceTokenMiddleware(req, res, next) {
    try {
        const token = await serviceTokenGenerator();

        req.headers.ServiceAuthorization = token.token;
    } catch (e) {
        console.log(e);
    }

    next();
}
