import * as healthcheck from '@hmcts/nodejs-healthcheck';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as appInsights from 'applicationinsights';
import * as session from 'express-session';
import * as sessionFileStore from 'session-file-store';
import { getRouter } from './api';
import { config } from './config';
import { InfoContributor, infoRequestHandler } from '@hmcts/info-provider';

const app = express();
const FileStore = sessionFileStore(session);

app.set('trust proxy', 1);
app.use(
    session({
        cookie: {
            httpOnly: true,
            maxAge: 31536000,
            secure: config.secureCookie !== false
        },
        name: 'jui-webapp',
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret,
        store: new FileStore({
            path: process.env.NOW ? '/tmp/sessions' : '.sessions'
        })
    })
);

// local logging improves on appInsights
if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    appInsights
        .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .start();

    const client = appInsights.defaultClient;
    client.trackTrace({ message: 'Test Message App Insight Activated' });

    app.use((req, res, next) => {
        client.trackNodeHttpRequest({ request: req, response: res });
        next();
    });
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function healthcheckConfig(msUrl) {
    return healthcheck.web(`${msUrl}/health`, {
        timeout: 6000,
        deadline: 6000
    });
}

app.get(
    '/health',
    healthcheck.configure({
        checks: {
            idam_api: healthcheckConfig(config.services.idam_api),
            s2s: healthcheckConfig(config.services.s2s),
            dm_store_api: healthcheckConfig(config.services.dm_store_api),
            em_anno_api: healthcheckConfig(config.services.em_anno_api),
            em_npa_api: healthcheckConfig(config.services.em_npa_api),
            dg_docassembly_api: healthcheckConfig(config.services.dg_docassembly_api)
        },
        buildInfo: {}
    })
);

function infocheckConfig(msUrl) {
    return new InfoContributor(`${msUrl}/info`);
}

app.get(
    '/info',
    infoRequestHandler({
        info: {
            idam_web: infocheckConfig(config.services.idam_web),
            idam_api: infocheckConfig(config.services.idam_api),
            s2s: infocheckConfig(config.services.s2s),
            dm_store_api: infocheckConfig(config.services.dm_store_api),
            em_anno_api: infocheckConfig(config.services.em_anno_api),
            em_npa_api: infocheckConfig(config.services.em_npa_api),
            dg_docassembly_api: infocheckConfig(config.services.dg_docassembly_api)
        },
        extraBuildInfo: {
            empty: {}
            // featureToggles: config.get('featureToggles'),
            // hostname: hostname()
        }
    })
);

const apiRouter = getRouter();

app.get('/oauth2/callback', apiRouter);
app.get('/logout', apiRouter);
app.use('/api', apiRouter);

module.exports = app;
