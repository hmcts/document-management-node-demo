"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodejs_logging_1 = require("@hmcts/nodejs-logging");
var bodyParser = require("body-parser");
var config = require("config");
var cookieParser = require("cookie-parser");
var csrf = require("csurf");
var express = require("express");
var expressNunjucks = require("express-nunjucks");
var helmet_1 = require("modules/helmet");
var path = require("path");
var routerFinder_1 = require("router/routerFinder");
var favicon = require("serve-favicon");
var env = process.env.NODE_ENV || "development";
exports.app = express();
exports.app.locals.ENV = env;
// setup logging of HTTP requests
exports.app.use(nodejs_logging_1.Express.accessLogger());
var logger = nodejs_logging_1.Logger.getLogger("app");
// secure the application by adding various HTTP headers to its responses
new helmet_1.Helmet(config.get("security")).enableFor(exports.app);
// view engine setup
exports.app.set("views", path.join(__dirname, "views"));
exports.app.set("view engine", "njk");
exports.app.use(express.static(path.join(__dirname, "public")));
exports.app.use(favicon(path.join(__dirname, "/public/img/favicon.ico")));
exports.app.use(bodyParser.json());
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use(cookieParser());
exports.app.use(express.static(path.join(__dirname, "public")));
expressNunjucks(exports.app);
if (config.useCSRFProtection === true) {
    var csrfOptions = {
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        },
    };
    exports.app.use(csrf(csrfOptions), function (req, res, next) {
        res.locals.csrfToken = req.csrfToken();
        next();
    });
}
exports.app.use("/", routerFinder_1.RouterFinder.findAll(path.join(__dirname, "routes")));
// returning "not found" page for requests with paths not resolved by the router
exports.app.use(function (req, res, next) {
    res.status(404);
    res.render("not-found");
});
// error handler
exports.app.use(function (err, req, res, next) {
    logger.error("" + (err.stack || err));
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = env === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});
