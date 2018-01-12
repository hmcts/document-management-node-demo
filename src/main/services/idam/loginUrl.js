
function loginUrl (continueUrl, args) {

    const idamLoginUrl = args.idamLoginUrl;

    if (continueUrl) {

        const redirectUrl = idamLoginUrl + '?continue-url=' + continueUrl;

        return redirectUrl;
    } else {

        //  something went wrong so go back to the root of the web app
        return '/';
    }
}

module.exports = loginUrl;
