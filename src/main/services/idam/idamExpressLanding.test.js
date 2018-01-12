const request = require('supertest');
let sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
const {expect} = require('chai');

const proxyquire = require('proxyquire');

const middleware = require('./idamExpressLanding');

let req, res, next;

let idamArgs;

describe('jwt query is not set', () => {

    beforeEach(() => {

        req = {
            query: {}
        };
        res = {};
        next = sinon.stub();

        idamArgs = {
            continueUrl: 'http://continue.url'
        };
    });

    it('should just call next', () => {

        const callback = middleware();

        callback(req, res, next);

        expect(next.callCount).to.equal(1);
    });
});

describe('jwt query is set', () => {

    beforeEach(() => {

        req = {
            query: {
                jwt: 'authTokenIsSet'
            }
        };
        res = {
            cookie: sinon.stub()
        };
        next = sinon.stub();

        idamArgs = {
            continueUrl: 'http://continue.url'
        };
    });

    it('should create a cookie then call next', () => {

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves(true);

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressLanding', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware();

        callback(req, res, next);

        expect(res.cookie.callCount).to.equal(1);
        expect(next.callCount).to.equal(1);
    });

    it('should just call next if an error occurs', () => {

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().rejects('error');

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressLanding', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware();

        callback(req, res, next);

        expect(res.cookie.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

});

describe('custom args have been set', () => {

    beforeEach(() => {

        req = {
            query: {
                jwt: 'authTokenIsSet'
            }
        };
        res = {
            cookie: sinon.stub()
        };
        next = sinon.stub();

        idamArgs = {
            continueUrl: 'http://continue.url'
        };
    });

    it('should still pass even with passed in args', () => {

        idamArgs.authTokenName = 'auth-token';
        idamArgs.cookieSecure = false;
        idamArgs.hostName = 'localhost';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves(true);

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressLanding', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.cookie.callCount).to.equal(1);
        expect(next.callCount).to.equal(1);
    });

    it('should not create a cookie then call next with wrong jqueryValue', () => {

        idamArgs.queryName = 'jwToken';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves(true);

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressLanding', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.cookie.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

    it('should create a cookie then call next with correct jwt name', () => {

        idamArgs.queryName = 'jwToken';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves(true);

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressLanding', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        req.query.jwToken = 'has.been.set';

        callback(req, res, next);

        expect(res.cookie.callCount).to.equal(1);
        expect(next.callCount).to.equal(1);
    });

});
