const express = require("express");
const config = require('config');
const authCheckerUserOnlyFilter = require('./node/user/auth-checker-user-only-filter');
const serviceFilter = require('./node/service/service-filter');
const cookieParser = require('cookie-parser');

let proxy = require('http-proxy-middleware');
let http = require("http");
let app = express();

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
app.get("/health", (req, res) => {
  res.send({
    status: "UP"
  });
});
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
