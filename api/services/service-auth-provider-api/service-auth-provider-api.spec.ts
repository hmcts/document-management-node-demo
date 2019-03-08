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
import { postS2SLease, serviceAuthRoutes } from './service-auth-provider-api';

const url = config.services.s2s

describe('service-auth-provider-api spec', () => {
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

        serviceAuthRoutes(app)

        request = supertest(app)
    })

    describe('postS2SLease', () => {

        it('should expose function', () => {
            expect(postS2SLease).to.be.ok
        })

        // need to figure out how to fake otp
        xit('should make a request', () => {
            postS2SLease()
            expect(httpRequest).to.have.been.calledWith('POST', `${url}/lease`, {})
        })
    })
})
