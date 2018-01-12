const getUserDetails = require('./details');

const logger = require('@hmcts/nodejs-logging').getLogger(__filename);

function idamExpressProtect (args = {}) {

    const authTokenName = args.authTokenName || '__auth-token';
    const indexUrl = args.indexUrl;
    const userDetailsKey = args.userDetailsKey || 'userDetails';
    const userIdentifier = args.userIdentifier || 'email';

    return (req, res, next) => {

        const authToken = req.cookies[authTokenName];

        const success = (response) => {

            //  if userDetails is not set in the session we can assume the service only wants to authenticate the token
            //  and not need to authenticate the current user matches the token, so we just continue
            const hasUserDetails = req.session && req.session[userDetailsKey];
            const userDoesNotMatchAuthToken = hasUserDetails && (req.session[userDetailsKey][userIdentifier] !== response[userIdentifier]);

            if (userDoesNotMatchAuthToken) {

                //  authToken mismatch so we can delete the cookie and force a login
                res.clearCookie(authTokenName);
                res.redirect(indexUrl);
            } else {

                next();
            }
        };

        const error = (err) => {

            logger.error(`Unable to authenticate jwt token: ${err}`);
            res.redirect(indexUrl);
        };

        if (authToken) {

            getUserDetails(authToken, args).then(success).catch(error);
        } else {

            //  no authentication cookie set, so redirect to index
            res.redirect(indexUrl);
        }
    }
}

module.exports = idamExpressProtect;
