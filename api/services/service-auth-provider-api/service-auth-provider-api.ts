import * as express from 'express';
import { config } from '../../../config';
import { generateRequest } from '../../lib/request/request';
import * as otp from 'otp';

const url = config.services.s2s;
const microservice = config.microservice;
const s2sSecret = config.s2sSecret;

export function postS2SLease() {
    const oneTimePassword = otp({ secret: s2sSecret }).totp();
    const options = {
        headers: {},
        body: {
            microservice,
            oneTimePassword
        }
    };

    return generateRequest('POST', `${url}/lease`, options);
}

export function serviceAuthRoutes(app) {
    const router = express.Router({ mergeParams: true });
    app.use('/s2s', router);
}
