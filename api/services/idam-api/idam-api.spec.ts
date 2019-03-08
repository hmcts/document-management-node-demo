import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import * as express from 'express'
import * as supertest from 'supertest'

chai.use(sinonChai)
const expect = chai.expect
const assert = chai.assert

import {config} from '../../../config'
import { idamRoutes, postOauthToken } from './idam-api';

const url = config.services.idam_api

describe('idam-api spec', () => {
    let request
    let app
    let httpRequest
    let httpResponse

    beforeEach(() => {
        httpResponse = (resolve, reject) => {
            resolve({})
        }
        httpRequest = sinon.stub()
        httpRequest.callsFake((url, options) => new Promise(httpResponse))

        app = express()

        idamRoutes(app)

        request = supertest(app)
    })

    describe('postOauthToken', () => {

        it('should expose function', () => {
            expect(postOauthToken).to.be.ok
        })

        // need to figure out how to fake otp
        xit('should make a request', () => {
            const code = 'abc12345'
            const host = 'fakehost'
            postOauthToken(code, host)
            expect(httpRequest).to.have.been.calledWith(
                'POST',
                `${url}/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=http://${host}/oauth2/callback`,
                {
                    Authorization: 'Basic anVpd2ViYXBwOkFBQUFBQUFBQUFBQUFBQUE=',
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
        })
    })
})
