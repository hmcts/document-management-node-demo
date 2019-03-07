import * as request from 'request-promise';

/**
 * TODO: Requires Unit tests as this is used everywhere to make requests to 3rd party
 * services.
 */

// ** actually - replace with axios - AJ

export function generateRequest(method, url, params) {
    const headers = params.headers ? Object.assign(params.headers) : {};

    let options = {
        body: '',
        formData: '' as any,
        method,
        url,
        headers: {
            ...headers,
            'Content-Type': params.headers['Content-Type'] || 'application/json'

        },
        json: true
    };

    if (params.body) options.body = params.body;
    if (params.formData) options.formData = params.formData;

    // if (config.configEnv !== 'mock') {
    //     if (config.useProxy) options = proxy(options)
    // }
    // N.B. Not needed - AJ

    return request(options);
}
