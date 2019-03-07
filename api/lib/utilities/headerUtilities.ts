

// TODO: need to deprecate this function
export function getAuthHeadersWithBody(req) {
    return {
        headers: {
            Authorization: `Bearer ${req.auth.token}`,
            ServiceAuthorization: req.headers.ServiceAuthorization
        },
        body: req.body ? req.body : {}
    }
}
