const express = require('express');
const config = require('config');

const { Logger, Express } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app.js')
const healthcheck = require('@hmcts/nodejs-healthcheck');
const { InfoContributor, infoRequestHandler  } = require('@hmcts/info-provider');

const authCheckerUserOnlyFilter = require('./node/user/auth-checker-user-only-filter');
const serviceFilter = require('./node/service/service-filter');
const cookieParser = require('cookie-parser');

const Security = require('./node/idam/security');

const security = new Security({
  clientId : config.get('idam').get('client_id'),
  clientSecret : config.get('idam').get('client_secret'),
  loginUrl: config.get('idam').get('login_url'),
  registrationUrl: config.get('idam').get('registration_url'),
  apiUrl: config.get('idam').get('base_url'),
  redirectUri: '/oauth2/callback'
});

let app = express();
let http = require("http");
let proxy = require('http-proxy-middleware');
app.use(cookieParser());
app.use(Express.accessLogger());

app.get("/health", healthcheck.configure({
  checks: {
    'dmStore' : healthcheck.web(config.get('dm_store_app_url') + "/health"),
    'emAnno' : healthcheck.web(config.get('em_anno_app_url') + "/health"),
    // 'emRedactApp' : healthcheck.web(config.get('em_redact_app_url') + "/health"),
    'idam' : healthcheck.web(config.get('idam').get('base_url') + "/health"),
    's2s' : healthcheck.web(config.get('idam').get('s2s_url') + "/health")
  },
  buildInfo: {

  }
}));

app.get('/info', infoRequestHandler({
  info: {
    'dmStore' :new InfoContributor(config.get('dm_store_app_url') + "/info"),
    'emAnno' : new InfoContributor(config.get('em_anno_app_url') + "/info"),
    // 'emRedactApp' : new InfoContributor(config.get('em_redact_app_url') + "/info"),
    'idam' : new InfoContributor(config.get('idam').get('base_url') + "/info"),
    's2s' : new InfoContributor(config.get('idam').get('s2s_url') + "/info")
  },
  extraBuildInfo: {
    // featureToggles: config.get('featureToggles'),
    // hostname: hostname()
  }
}));


app.use('/logout', security.logout());
app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());
//see https://git.reform.hmcts.net/reform-idam/registration-web/blob/master/app.js for how to use security


app.use('/demproxy', authCheckerUserOnlyFilter);
app.use('/demproxy', serviceFilter);

app.use('/demproxy', security.protect() , proxy({
    target: config.get('dm_store_app_url'),
    logLevel: 'info',
    secure: false,
    rejectUnauthorized: false,
    changeOrigin: true,
    router: {
      '/demproxy/dm': config.get('dm_store_app_url'),
      '/demproxy/an': config.get('em_anno_app_url'),
    },
    pathRewrite: {
      '^/demproxy/dm': '/',
      '^/demproxy/an': '/',
    },
    onProxyReq: (proxyReq, req, res) => {
      if (!req.headers['ServiceAuthorization'] ||
        !req.headers['user-id'] ||
        !req.headers['user-roles']) {
        throw new Error("Missing DEM required headers")
      }
    },
    logProvider: () => Logger.getLogger('http-proxy-middleware')
  }
));

app.use('', security.protect(), express.static('dist'));
app.use('/list', security.protect(), express.static('dist'));
app.use('/upload', security.protect(), express.static('dist'));
app.use('/viewer', security.protect(), express.static('dist'));
app.use('/summary', security.protect() ,express.static('dist'));

app.get("/config", (req, res) => {
  res.send(config.get ('ng_config'));
});


app.use('/demproxy', (err, req, res, next) => {
  logger.info({message:'demproxy()' + JSON.stringify(err)})

  res.contentType('application/json');
  res.json(err);
});

const port = process.env.PORT || "3608";
const server = http.createServer(app);

app.set("port", port);

server.listen(port);
