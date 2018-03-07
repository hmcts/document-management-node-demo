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

app.use('/viewer', authCheckerUserOnlyFilter);
app.use('/viewer', serviceFilter);
app.use(cookieParser());

app.use('/viewer', proxy({
  target: config.dm_url,
  router: {
    '/viewer/dm' : config.dm_url,
    '/viewer/an' : config.an_url,
  },
  pathRewrite: {
    '^/viewer/dm': '/',
    '^/viewer/an': '/',
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

app.get("/health", healthcheck.configure({
  checks: {
    'dm-api-gw-web' : healthcheck.web(config.get('dm_gw_url') + "/health"),
    // 'em-api-gw-web' : healthcheck.web(config.get('em_gw_url') + "/health"),
    'em-viewer-web' : healthcheck.web(config.get('em_viewer_url') + "/health")
  },
  buildInfo: {}
}));

app.get('/info', infoRequestHandler({
    info: {
      // 'dm-api-gw-web': new InfoContributor(config.get('dm_gw_url') + '/info'),
      // 'em-api-gw-web': new InfoContributor(config.get('em_gw_url')  + '/info'),
      // 'em-viewer-web': new InfoContributor(config.get('em_viewer_url') + '/info')
    },
    extraBuildInfo: {
      // featureToggles: config.get('featureToggles'),
      // hostname: hostname()
    }
  }));

app.get("/config", (req, res) => {
  res.send(config);
});

app.use('/viewer', (err, req, res, next) => {
  res.contentType('application/json');
  res.json(err);
});


const port = process.env.PORT || "3608";
const server = http.createServer(app);

app.set("port", port);

server.listen(port);