const idamExpressAuthenticate = require('./idamExpressAuthenticate');
const idamExpressLanding = require('./idamExpressLanding');
const idamExpressProtect = require('./idamExpressProtect');

function authenticate (args = {}) {
    return idamExpressAuthenticate(args);
};

function landingPage (args = {}) {
    return idamExpressLanding(args);
};

function protect (args = {}) {
    return idamExpressProtect(args);
};

module.exports = { authenticate, landingPage, protect };
