const request = require('supertest');
let sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
const {expect} = require('chai');

const proxyquire = require('proxyquire');

const middleware = require('./idamExpressAuthenticate');

let req, res, next;
let idamArgs = {
    continueUrl: 'http://continue.url'
}

describe('auth token is not set', () => {

    beforeEach(() => {

        req = {
            cookies: {}
        };
        res = {
            redirect: sinon.stub()
        };
        next = sinon.stub();
    });

    it('should redirect to the idam login page', () => {

        const idamWrapperStub = function (args) {

            const getIdamLoginUrl = sinon.stub().callsFake((continueUrl) => {
                return 'http://login.url?continue-url=' + continueUrl;
            });

            return { getIdamLoginUrl };
        }

        const interceptedMiddleware = proxyquire('./idamExpressAuthenticate', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('http://login.url?continue-url=http://continue.url')).to.equal(true);
    });
});

describe('auth token is set', () => {

    beforeEach(() => {

        req = {
            cookies: {
                '__auth-token': 'exists'
            }
        };
        res = {
            redirect: sinon.stub()
        };
        next = sinon.stub();
    });

    it('should call next on success', () => {

        const idamWrapperStub = function (args) {

            const getIdamLoginUrl = sinon.stub().callsFake((continueUrl) => {
                return 'http://login.url?continue-url=' + continueUrl;
            });
            const getUserDetails = sinon.stub().returnsPromise().resolves('success');

            return { getIdamLoginUrl, getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressAuthenticate', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

    it('should redirect on error', () => {

        const idamWrapperStub = function (args) {

            const getIdamLoginUrl = sinon.stub().callsFake((continueUrl) => {
                return 'http://login.url?continue-url=' + continueUrl;
            });
            const getUserDetails = sinon.stub().returnsPromise().rejects('error');

            return { getIdamLoginUrl, getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressAuthenticate', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('http://login.url?continue-url=http://continue.url')).to.equal(true);
    });
});

describe('custom args have been set', () => {

    beforeEach(() => {

        req = {
            cookies: {
                '__auth-token': 'exists'
            }
        };
        res = {
            redirect: sinon.stub()
        };
        next = sinon.stub();
    });

    it('should redirect to login since authTokenName is not the correct cookie name', () => {

        idamArgs.authTokenName = 'auth-token';

        const idamWrapperStub = function (args) {

            const getIdamLoginUrl = sinon.stub().callsFake((continueUrl) => {
                return 'http://login.url?continue-url=' + continueUrl;
            });

            return { getIdamLoginUrl };
        }

        const interceptedMiddleware = proxyquire('./idamExpressAuthenticate', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('http://login.url?continue-url=http://continue.url')).to.equal(true);
    });

    it('should pass in the auth cookie name as set in the args', () => {

        req.cookies = { 'auth-token' : 'exists' };
        idamArgs.authTokenName = 'auth-token';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves('success');

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressAuthenticate', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

});
