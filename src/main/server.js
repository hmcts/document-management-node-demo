#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodejs_logging_1 = require("@hmcts/nodejs-logging");
var fs = require("fs");
var https = require("https");
var path = require("path");
var app_1 = require("./app");
var logger = nodejs_logging_1.Logger.getLogger("server");
// TODO: set the right port for your application
var port = parseInt(process.env.PORT, 10) || 3100;
if (app_1.app.locals.ENV === "development") {
    var sslDirectory = path.join(__dirname, "resources", "localhost-ssl");
    var sslOptions = {
        cert: fs.readFileSync(path.join(sslDirectory, "localhost.crt")),
        key: fs.readFileSync(path.join(sslDirectory, "localhost.key")),
    };
    var server = https.createServer(sslOptions, app_1.app);
    server.listen(port, function () {
        logger.info("Application started: https://localhost:" + port);
    });
}
else {
    app_1.app.listen(port, function () {
        logger.info("Application started: http://localhost:" + port);
    });
}
