const request = require('request-promise-native');


function details (authToken, args) {

    const idamApiUrl = args.idamApiUrl;

    const options = {
        uri: idamApiUrl + '/details',
        headers: {
            'Authorization' : 'Bearer ' + authToken
        }
    };

    return request(options);
}

module.exports = details;
