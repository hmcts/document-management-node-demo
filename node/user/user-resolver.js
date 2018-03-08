const config = require('config')
const fetch = require('../util/fetch')

const {logging} = require('../logging/dm-logger')
const logger = logging.getLogger('user-resolver.js')

const getTokenDetails = (jwt) => {
  const bearerJwt = jwt.startsWith('Bearer ') ? jwt : 'Bearer ' + jwt

  return fetch(`${config.get('idam.base_url')}/details`, {
    headers: {
      'Authorization': bearerJwt
    }
  }).then(res => res.json())
    .catch(error => {
      logger.warn(JSON.stringify({
        errorMessage: 'Non 200 status received from IDAM when authenticating user. Is your token valid?',
        statusText: error.statusText,
        status: error.status,
        url: error.url,
        stackTrace: error.stack
      }))
      throw error
    })
}

exports.getTokenDetails = getTokenDetails
