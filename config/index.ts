
function getEnvOr(property: string, defaultValue: string) {
    return (typeof process !== 'undefined' && process.env[property]) || defaultValue;
}

export const config = {
    services: {
        idam_web: getEnvOr('IDAM_WEB_URL', 'https://localhost:3501'),
        idam_api: getEnvOr('IDAM_USER_BASE_URI', 'http://idam-api:8080'),
        s2s: getEnvOr('IDAM_S2S_BASE_URI', 'http://service-auth-provider-app:8489'),
        dm_store_api: getEnvOr('DM_STORE_APP_URI', 'http://localhost:4603'),
        em_anno_api: getEnvOr('EM_ANNO_APP_URI', 'http://localhost:3621'),
        em_npa_api: getEnvOr('EM_NPA_APP_URI', 'http://localhost:3622'),
        dg_docassembly_api: getEnvOr('DG_DOCASSEMBLY_API_URI', 'http://rpa-dg-docassembly-api:8080')
    },
    cookies: {
        token: '__auth__',
        userId: '__userid__'
    },
    microservice: 'em_gw',
    idamClient: 'webshow',
    idamSecret: getEnvOr('IDAM_SECRET', 'AAAAAAAAAAAAAAAA'),
    oauthCallback: 'oauth2/callback',
    protocol: getEnvOr('HTTP_PROTOCOL', 'http'),
    s2sSecret: getEnvOr('IDAM_SERVICE_KEY', 'AAAAAAAAAAAAAAAA'),
    secureCookie: getEnvOr('HTTP_PROTOCOL', 'http') === 'https',
    sessionSecret: 'secretSauce',
    logging: getEnvOr('LOG_LEVEL', 'debug')
};
