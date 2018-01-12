const getLoginUrl = require('./loginUrl');
const getUserDetails = require('./details');
const config = require('config');

const logger = require('@hmcts/nodejs-logging').getLogger(__filename);

function idamExpressAuthenticate (args = {}) {

    const authTokenName = args.authTokenName || '__auth-token';
    const continueUrl = args.continueUrl;

    return (req, res, next) => {

        const authToken = req.cookies[authTokenName] || req[authTokenName];

        const authenticated = (response) => {
            let responseJson = JSON.parse(response);
            res.locals.userEmail = response.email;
            res.locals.idam = responseJson
            res.locals.userGroup = config.get('userGroup');
            res.locals.isUserGroupA = config.get('userGroup').userGroupAUsers.indexOf(responseJson.email) >= 0;
            res.locals.isUserGroupB = config.get('userGroup').userGroupBUsers.indexOf(responseJson.email) >= 0;
            res.locals.isUserGroupC = config.get('userGroup').userGroupCUsers.indexOf(responseJson.email) >= 0;
            res.locals.isUserGroupAorB = res.locals.isUserGroupA ? config.get('userGroup').userGroupAName : ( res.locals.isUserGroupB ? config.get('userGroup').userGroupBName : null ) ;
            next();
        };

        const error = (err) => {
            logger.error(`Unable to authenticate jwt token: ${err}`);
            res.redirect(getLoginUrl(continueUrl, args));
        };

        if (authToken) {
            getUserDetails(authToken, args).then(authenticated).catch(error);
        } else {

            //  no authentication cookie set, so redirect to login
            res.redirect(getLoginUrl(continueUrl, args));
        }
    }
}

module.exports = idamExpressAuthenticate;
