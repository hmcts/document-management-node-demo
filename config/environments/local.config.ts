export default {
    services: {
        ccd_data_api:
            'https://ccd-data-store-api-aat.service.core-compute-aat.internal',
        ccd_def_api:
            'https://ccd-definition-store-api-aat.service.core-compute-aat.internal',
        idam_web: 'https://localhost:3501',
        idam_api: 'http://localhost:4501',
        s2s:
            'http://localhost:4502',
        draft_store_api:
            'https://draft-store-service-aat.service.core-compute-aat.internal',
        dm_store_api: 'https://dm-store-aat.service.core-compute-aat.internal',
        em_anno_api: 'https://em-anno-aat.service.core-compute-aat.internal',
        em_npa_api: 'https://em-npa-aat.service.core-compute-aat.internal',
        coh_cor_api: 'https://coh-cor-aat.service.core-compute-aat.internal',
        dg_docassembly_api: 'http://localhost:4631'
    },
    useProxy: false,
    protocol: 'http',
    secureCookie: false,
    sessionSecret: 'secretSauce',
    logging: 'debug'
};
