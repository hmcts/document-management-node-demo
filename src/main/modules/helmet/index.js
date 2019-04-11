"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helmet = require("helmet");
var googleAnalyticsDomain = "*.google-analytics.com";
var hmctsPiwikDomain = "hmctspiwik.useconnect.co.uk";
var self = "'self'";
/**
 * Module that enables helmet in the application
 */
var Helmet = /** @class */ (function () {
    function Helmet(config) {
        this.config = config;
    }
    Helmet.prototype.enableFor = function (app) {
        // include default helmet functions
        app.use(helmet());
        this.setContentSecurityPolicy(app);
        this.setReferrerPolicy(app, this.config.referrerPolicy);
        this.setHttpPublicKeyPinning(app, this.config.hpkp);
    };
    Helmet.prototype.setContentSecurityPolicy = function (app) {
        app.use(helmet.contentSecurityPolicy({
            directives: {
                connectSrc: [self],
                defaultSrc: ["'none'"],
                fontSrc: [self, "data:"],
                imgSrc: [self, googleAnalyticsDomain, hmctsPiwikDomain],
                objectSrc: [self],
                scriptSrc: [self, googleAnalyticsDomain, hmctsPiwikDomain],
                styleSrc: [self],
            },
        }));
    };
    Helmet.prototype.setReferrerPolicy = function (app, policy) {
        if (!policy) {
            throw new Error("Referrer policy configuration is required");
        }
        app.use(helmet.referrerPolicy({ policy: policy }));
    };
    Helmet.prototype.setHttpPublicKeyPinning = function (app, hpkpConfig) {
        app.use(helmet.hpkp({
            maxAge: hpkpConfig.maxAge,
            sha256s: hpkpConfig.sha256s,
        }));
    };
    return Helmet;
}());
exports.Helmet = Helmet;
