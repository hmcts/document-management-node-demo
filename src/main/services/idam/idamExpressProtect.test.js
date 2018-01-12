
const request = require('supertest');
let sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
const {expect} = require('chai');

const proxyquire = require('proxyquire');

const middleware = require('./idamExpressProtect');

let req, res, next;
let args;

let idamArgs;

describe('auth token is not set', () => {

    beforeEach(() => {

        req = {
            cookies: {}
        };
        res = {
            redirect: sinon.stub(),
            clearCookie: sinon.stub()
        };
        next = sinon.stub();

        idamArgs = {
            continueUrl: 'http://continue.url',
            indexUrl: '/index'
        }
    });

    it('should redirect to the passed in index url arg', () => {

        const callback = middleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('/index')).to.equal(true);
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
            redirect: sinon.stub(),
            clearCookie: sinon.stub()
        };
        next = sinon.stub();

        idamArgs = {
            continueUrl: 'http://continue.url',
            indexUrl: '/index'
        }
    });

    it('should call next on success and there is no userDetails', () => {

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

    it('should call next on success and userDetails are a match', () => {

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        req.session = {
            userDetails: {email : 'test@example.com'}
        }

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

    it('should call redirect when user details are not a match', () => {

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        req.session = {
            userDetails: {email : 'test@example.co.uk'}
        }

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('/index')).to.equal(true);
        expect(next.callCount).to.equal(0);
    });

    it('should redirect on error', () => {

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().rejects('error');

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('/index')).to.equal(true);
        expect(next.callCount).to.equal(0);
    });
});

describe('custom args are set', () => {

    beforeEach(() => {

        req = {
            cookies: {
                '__auth-token': 'exists'
            }
        };
        res = {
            redirect: sinon.stub(),
            clearCookie: sinon.stub()
        };
        next = sinon.stub();

        idamArgs = {
            continueUrl: 'http://continue.url',
            indexUrl: '/index'
        }
    });

    it('should still succeed with set custom args', () => {

        req.cookies = { 'auth-token' : 'exists' };
        idamArgs.authTokenName = 'auth-token';
        idamArgs.userDetailsKey = 'newUserDetails';
        idamArgs.userIdentifier = 'id';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

    it('should redirect to index with no custom auth token name found', () => {

        idamArgs.authTokenName = 'auth-token';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('/index')).to.equal(true);
        expect(next.callCount).to.equal(0);
    });

    it('should call next when user details key and id exists and matches', () => {

        idamArgs.userDetailsKey = 'newUserDetails';
        idamArgs.userIdentifier = 'id';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com', id: '1'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        req.session = {
            newUserDetails: {id : '1'}
        };

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

    it('should just call next if there is no userDetails set according to the custom arg, assumes not required check', () => {

        idamArgs.userDetailsKey = 'newUserDetails';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com', id: '1'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        req.session = {
            userDetails: {id : '1', email : 'test@example.com'}
        };

        callback(req, res, next);

        expect(res.redirect.callCount).to.equal(0);
        expect(next.callCount).to.equal(1);
    });

    it('should redirect to index and clear cookies when user details key matches but userIdentifier does not', () => {

        idamArgs.userDetailsKey = 'newUserDetails';

        const idamWrapperStub = function (args) {

            const getUserDetails = sinon.stub().returnsPromise().resolves({email : 'test@example.com', id: '1'});

            return { getUserDetails };
        }

        const interceptedMiddleware = proxyquire('./idamExpressProtect', { '@divorce/idam-wrapper': idamWrapperStub });

        const callback = interceptedMiddleware(idamArgs);

        req.session = {
            newUserDetails: {id : '1'}
        };

        callback(req, res, next);

        expect(res.clearCookie.callCount).to.equal(1);
        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('/index')).to.equal(true);
        expect(next.callCount).to.equal(0);
    });
});
