"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var os = require("os");
var info_provider_1 = require("@hmcts/info-provider");
var router = express.Router();
router.get("/info", info_provider_1.infoRequestHandler({
    extraBuildInfo: {
        host: os.hostname(),
        name: "expressjs-template",
        uptime: process.uptime(),
    },
    info: {
    // TODO: add downstream info endpoints if your app has any
    },
}));
module.exports = router;
