const serviceTokenGenerator = require('./service-token-generator')
const { Logger } = require('@hmcts/nodejs-logging')
const logger = Logger.getLogger('service-filter.js')

const serviceFilter = (req, res, next) => {
  serviceTokenGenerator()
    .then(t => {
      req.headers['ServiceAuthorization'] = t;
      next()
    })
    .catch(error => {
      logger.warn({ message: 'Unsuccessful S2S authentication'})
      next({ status: error.status || 401 })
    })
}

module.exports = serviceFilter
