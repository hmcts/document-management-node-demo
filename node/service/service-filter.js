const serviceTokenGenerator = require('./service-token-generator')
const {logging} = require('../logging/dm-logger')
const logger = logging.getLogger('service-filter.js')

const serviceFilter = (req, res, next) => {
  serviceTokenGenerator()
    .then(t => {
      req.headers['ServiceAuthorization'] = t;
      next()
    })
    .catch(error => {
      logger.warn(JSON.stringify({
        error: 'Unsuccessful S2S authentication'
      }))
      next({
        status: error.status || 401
      })
    })
}

module.exports = serviceFilter
