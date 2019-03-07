import * as express from 'express';
import * as authInterceptor from './lib/middleware/auth';
import * as serviceTokenMiddleware from './lib/middleware/service-token';
import { auth } from './controllers/auth';
import { docAssemblyRoutes } from './services/dg-docassembly-api/dg-docassembly-api';
import { emAnnoRoutes } from './services/em-anno-api/em-anno-api';
import { emNpaRoutes } from './services/em-npa-api/em-npa-api';
import { idamRoutes } from './services/idam-api/idam-api';
import { serviceAuthRoutes } from './services/service-auth-provider-api/service-auth-provider-api';

export function getRouter() {
    const router = express.Router();

    router.use(serviceTokenMiddleware);
    auth(router);
    router.use(authInterceptor);

    idamRoutes(router);
    serviceAuthRoutes(router);
    emNpaRoutes(router);
    emAnnoRoutes(router);
    docAssemblyRoutes(router);

    return router;
}
