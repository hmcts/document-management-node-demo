const request = require('request-promise-native');

function authorisationCheck (authToken, role, args) {

    const idamApiUrl = args.idamApiUrl;

    const options = {
        uri: idamApiUrl + '/authorisation-check?role=' + role,
        headers: {
            'Authorization' : 'Bearer ' + authToken
        }
    };

    return request(options);
}

module.exports = authorisationCheck;
