const request = require('request-promise')

module.exports = (method, url, params) => {
    const options: any = {
        method,
        url,
        headers: {
            ...params.headers,
            'Content-Type': 'application/json'
        },
        json: true
    }

    if (params.body) options.body = params.body

    return request(options)
}
