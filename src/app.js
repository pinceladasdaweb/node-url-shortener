const {
  LOG_LEVEL,
  NODE_ENV,
  REDIS_PORT,
  REDIS_PASSWORD,
  POSTGRESQL_HOST,
  POSTGRESQL_PORT,
  POSTGRESQL_USER,
  POSTGRESQL_DATABASE,
  POSTGRESQL_PASSWORD
} = require('./environment')
const Fastify = require('fastify')

const logger = {
  development: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: 'time,pid,hostname'
    },
    level: LOG_LEVEL
  },
  production: {
    formatters: {
      level (level) {
        return { level }
      }
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    level: LOG_LEVEL
  }
}

const app = async () => {
  const fastify = Fastify({
    ajv: {
      customOptions: {
        allErrors: true,
        jsonPointers: true,
        $data: true
      },
      plugins: [
        require('ajv-errors'),
        require('ajv-keywords')
      ]
    },
    bodyLimit: 1048576,
    logger: logger[NODE_ENV]
  })

  await fastify.register(require('fastify-redis'), {
    host: 'redis',
    port: REDIS_PORT,
    password: REDIS_PASSWORD
  })
  await fastify.register(require('fastify-postgres'), {
    connectionString: `postgres://${POSTGRESQL_USER}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_HOST}:${POSTGRESQL_PORT}/${POSTGRESQL_DATABASE}`
  })
  await fastify.register(require('fastify-etag'))
  await fastify.register(require('fastify-helmet'), {
    contentSecurityPolicy: {
      directives: {
        baseUri: ['\'self\''],
        defaultSrc: ['\'self\''],
        scriptSrc: ['\'self\''],
        objectSrc: ['\'self\''],
        workerSrc: ['\'self\'', 'blob:'],
        frameSrc: ['\'self\''],
        formAction: ['\'self\''],
        upgradeInsecureRequests: []
      }
    }
  })
  await fastify.register(require('fastify-cors'), { origin: '*' })
  await fastify.register(require('./plugins/sentry'))
  await fastify.register(require('./routes/api'))
  await fastify.register(require('./hooks'))

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.debug(`Route not found: ${request.method}:${request.raw.url}`)

    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.raw.url} not found`
    })
  })

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.debug(`Request url: ${request.raw.url}`)
    fastify.log.debug(`Payload: ${request.body}`)
    fastify.log.error(`Error occurred: ${err}`)

    const code = err.statusCode ?? 500

    reply.status(code).send({
      statusCode: code,
      error: err.name ?? 'Internal server error',
      message: err.message ?? err
    })
  })

  return fastify
}

module.exports = {
  app
}
