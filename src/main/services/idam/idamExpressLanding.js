const getUserDetails = require('./details');

const url = require('url');

const logger = require('@hmcts/nodejs-logging').getLogger(__filename);

function idamExpressLanding (args = {}) {

    const authTokenName = args.authTokenName || '__auth-token';
    const cookieSecure = args.cookieSecure || process.env.PUBLIC_PROTOCOL === 'https';
    const hostName = args.hostName || process.env.PUBLIC_HOSTNAME;

    return (req, res, next) => {

        const jwtQueryValue = args.queryName ? req.query[args.queryName] : req.query['jwt'];

        if (jwtQueryValue) {

            const success = (response) => {

                res.cookie(authTokenName, jwtQueryValue, {
                    secure: cookieSecure,
                    httpOnly: true,
                    domain: hostName
                });

                res.redirect(url.parse(req.url).pathname);
            };

            const error = (err) => {

                logger.error(`Unable to get user details (${req.url}) with jwt (${jwtQueryValue}) token data: ${err}`);

                //  let the protect middleware handle any errors
                next();
            };

            getUserDetails(jwtQueryValue, args).then(success).catch(error);

        } else {

            next();
        }
    }
}

module.exports = idamExpressLanding;
