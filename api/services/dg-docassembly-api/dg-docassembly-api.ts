import * as proxy from "http-proxy-middleware";
import {config} from '../../../config';

function injectHeaders(proxyRequest, request) {
    proxyRequest.setHeader('Authorization', `Bearer ${request.auth.token}`);
    proxyRequest.setHeader('ServiceAuthorization', request.headers.ServiceAuthorization);
}

export function docAssemblyRoutes(app) {
    const proxyConfig = {
        onProxyReq: injectHeaders,
        target: config.services.dg_docassembly_api,
    };

    const urls = [
      '/api/form-definitions',
      '/api/template-renditions',
      '/health',
    ];

    app.use(proxy(urls, proxyConfig));
}
