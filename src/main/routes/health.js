"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var healthcheck = require("@hmcts/nodejs-healthcheck");
var express = require("express");
var router = express.Router();
router.get("/health", healthcheck.configure({
    checks: {
        // TODO: replace this sample check with proper checks for your application
        sampleCheck: healthcheck.raw(function () { return healthcheck.up(); }),
    },
}));
module.exports = router;
