#!/usr/bin/env node

// TODO move these setting to a better place
import * as checkDefaultEnv from "./modules/util/index";

checkDefaultEnv("ROOT_APPENDER", "JSON_CONSOLE");
checkDefaultEnv("JSON_CONSOLE_PRETTY_PRINT", "false");
checkDefaultEnv("LOG_OUTPUT", "human");
checkDefaultEnv("REFORM_SERVICE_TYPE", "node");
checkDefaultEnv("REFORM_SERVICE_NAME", "document-management-node-demo");
checkDefaultEnv("REFORM_TEAM", "evidence");
checkDefaultEnv("REFORM_ENVIRONMENT", "docker");

import * as logging from "@hmcts/nodejs-logging";
// import * as fs from "fs";
// import * as https from "https";
// import * as path from "path";
import { app } from "./app";

const logger = logging.getLogger("server");

// TODO: set the right port for your application
const port: number = parseInt(process.env.PORT, 10) || 3608;

logger.info("ENV is " + app.locals.ENV);

app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
});
