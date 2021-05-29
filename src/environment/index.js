const env = process.env
const dotenv = require('dotenv')
const { deepFreeze } = require('../utils')

dotenv.config()

const enviroment = deepFreeze({
  /* GENERAL */
  LOG_LEVEL: env.LOG_LEVEL,
  NODE_ENV: env.NODE_ENV,
  APP_PORT: env.APP_PORT,
  /* DATABASE */
  POSTGRESQL_HOST: env.POSTGRESQL_HOST,
  POSTGRESQL_PORT: env.POSTGRESQL_PORT,
  POSTGRESQL_USER: env.POSTGRESQL_USER,
  POSTGRESQL_DATABASE: env.POSTGRESQL_DATABASE,
  POSTGRESQL_PASSWORD: env.POSTGRESQL_PASSWORD,
  /* MONITORING */
  SENTRY_DSN: env.SENTRY_DSN
})

module.exports = enviroment
