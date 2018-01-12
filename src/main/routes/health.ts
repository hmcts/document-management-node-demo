// TODO - Maybe needs to moved
import * as config from "config";
import * as checkDefaultEnv from "modules/util";
checkDefaultEnv("PACKAGES_ENVIRONMENT", "local");
checkDefaultEnv("PACKAGES_PROJECT", "evidence");
checkDefaultEnv("PACKAGES_NAME", "document-management-node-demo");
checkDefaultEnv("PACKAGES_VERSION", "unknown");

import * as healthcheck from "@hmcts/nodejs-healthcheck";
import * as express from "express";
import * as os from "os";

const router = express.Router();

const emGwHealthcheck = (url) => {
return healthcheck.web(url, {
    callback: (err, res) => {
      if (res && res.body && res.body.status && res.body.status === "UP") {
        return healthcheck.up(res.body);
      } else {
        if (res && res.body) {
          return healthcheck.down(res.body);
        } else {
          return healthcheck.down();
        }
      }
    },
    deadline: 10000,
    timeout: 5000,
  });
};

router.get("/health", healthcheck.configure({
    buildInfo: {
        host: os.hostname(),
        uptime: process.uptime(),
    },
    checks: {
        documentManagementApiGatewayWeb: emGwHealthcheck(config.get("services").dmApiGwUrl + "/health"),
        documentManagementNodeDemo: healthcheck.raw(() => healthcheck.up()),
        // documentManagementViewer: emGwHealthcheck(config.get('services').dmViewerUrl + '/health'),
    },
}));

module.exports = router;
