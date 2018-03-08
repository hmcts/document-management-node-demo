const config = require('config')
const checkDefaultEnv = require('../util/envChange')

// Set default Logging variable if not already set
checkDefaultEnv('ROOT_APPENDER', 'JSON_CONSOLE')
checkDefaultEnv('LOG_OUTPUT', 'human') // Default log view ['human' | 'single' | 'multi' ]
// checkDefaultEnv('LOG_OUTPUT','single') //Default log view ['human' | 'single' | 'multi' ]
checkDefaultEnv('JSON_CONSOLE_PRETTY_PRINT', true)
// Setup Default Logging and logger (use logger.info to log)
const logging = require('@hmcts/nodejs-logging')
logging.config(config.get('logging'))
const logger = logging.getLogger('dm-logger.js')

module.exports = {
  logging: logging,
  logger: logger
}
