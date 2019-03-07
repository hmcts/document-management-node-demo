import * as express from 'express';
import { config } from '../../../config';
import { generateRequest } from '../../lib/request/request';

const url = config.services.idam_api;
const idamSecret = config.idamSecret;
const idamClient = config.idamClient;
const idamProtocol = config.protocol;
const oauthCallbackUrl = config.oauthCallback;

export function getDetails(options) {
    return generateRequest('GET', `${url}/details`, options);
}

export function postOauthToken(code, host) {
    const redirectUri = `${idamProtocol}://${host}/${oauthCallbackUrl}`;
    const urlX = `${url}/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`;

    const options = {
        headers: {
            Authorization: `Basic ${Buffer.from(`${idamClient}:${idamSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    return generateRequest('POST', `${urlX}`, options);
}

export function idamRoutes(app) {
    const router = express.Router({ mergeParams: true });

    app.use('/idam', router);
}
