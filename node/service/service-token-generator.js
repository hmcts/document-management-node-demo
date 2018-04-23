const otp = require('otp')
const config = require('config')
const jwtDecode = require('jwt-decode')
const fetch = require('../util/fetch')

const idamS2SUrl = config.get('idam.s2s_url')
const serviceName = config.get('idam.service_name')
const secret = config.get('idam.service_key')

const {logging} = require('../logging/dm-logger')
const logger = logging.getLogger('service-token-generator.js')

const cache = {}

const serviceTokenGenerator = () => {
  const currentTime = Math.floor(Date.now() / 1000)

  if (cache[serviceName] && currentTime < cache[serviceName].expiresAt) {
    return Promise.resolve(cache[serviceName].token)
  } else {

    const body = {
      microservice: serviceName,
      oneTimePassword: otp({secret: secret}).totp()
    }

    return fetch(`${idamS2SUrl}/lease`,
      {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
      })
      .then(res => res.text())
      .then(token => {
        const tokenData = jwtDecode(token)
        cache[serviceName] = {
          expiresAt: tokenData.exp,
          token: token
        }

        return token
      })
      .catch(error => {
        logger.warn(JSON.stringify({
          errorMessage: 'Non 200 status received from S2S when getting service token.',
          statusText: error.statusText,
          status: error.status,
          url: error.url,
          stackTrace: error.stack
        }))
        throw error
      })
  }
}

module.exports = serviceTokenGenerator
