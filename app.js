const express = require("express");
const config = require('config');

// const { Logger } = require('@hmcts/nodejs-logging');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const { InfoContributor, infoRequestHandler  } = require('@hmcts/info-provider');

const authCheckerUserOnlyFilter = require('./node/user/auth-checker-user-only-filter');
const serviceFilter = require('./node/service/service-filter');
const cookieParser = require('cookie-parser');

let app = express();
let http = require("http");
let proxy = require('http-proxy-middleware');

app.use(cookieParser());
app.use('/demproxy', authCheckerUserOnlyFilter);
app.use('/demproxy', serviceFilter);

app.use('/demproxy', proxy({
  target: config.dm_store_app_url,
  logLevel: 'debug,'
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
  }
}));

app.use('',express.static('dist'));
app.use('/list',express.static('dist'));
app.use('/upload',express.static('dist'));
app.use('/viewer',express.static('dist'));
app.use('/summary',express.static('dist'));

app.get("/config", (req, res) => {
  res.send(config);
});

app.get("/health", healthcheck.configure({
  checks: {
    'dmStoreApp' : healthcheck.web(config.get('dm_store_app_url') + "/health"),
    'emAnnoApp' : healthcheck.web(config.get('em_anno_app_url') + "/health"),
    // 'emRedactApp' : healthcheck.web(config.get('em_redact_app_url') + "/health"),
    'idam' : healthcheck.web(config.get('idam').get('base_url') + "/health"),
    'idamS2S' : healthcheck.web(config.get('idam').get('s2s_url') + "/health")
  },
  buildInfo: {}
}));

app.get('/info', infoRequestHandler({
    info: {
      'dmStoreApp' :new InfoContributor(config.get('dm_store_app_url') + "/info"),
      'emAnnoApp' : new InfoContributor(config.get('em_anno_app_url') + "/info"),
      // 'emRedactApp' : new InfoContributor(config.get('em_redact_app_url') + "/info"),
      'idam' : new InfoContributor(config.get('idam').get('base_url') + "/info"),
      'idamS2S' : new InfoContributor(config.get('idam').get('s2s_url') + "/info")
    },
    extraBuildInfo: {
      // featureToggles: config.get('featureToggles'),
      // hostname: hostname()
    }
  }));

app.use('/demproxy', (err, req, res, next) => {
  res.contentType('application/json');
  res.json(err);
});

const port = process.env.PORT || "3608";
const server = http.createServer(app);

app.set("port", port);

server.listen(port);
