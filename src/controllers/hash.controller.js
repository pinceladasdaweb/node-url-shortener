const {
  REDIS_NAMESPACE
} = require('../environment')
const boom = require('@hapi/boom')
const parseJson = require('parse-json')
const { NOT_FOUND } = require('../errors')
const { NotFound } = require('http-errors')
const schema = require('./concerns/sjs-schema')
const { daysToSeconds, pick, Base62 } = require('../utils')

const redirect = async function (request, reply) {
  try {
    const { hash } = request.params

    const jsonString = await this.redis[REDIS_NAMESPACE].get(hash)

    if (jsonString) {
      const parsedJSON = parseJson(jsonString)

      if (parsedJSON.private) {
        return NotFound(NOT_FOUND)
      }

      reply.code(302).redirect(parsedJSON.url)
    } else {
      const id = Base62.decode(hash)
      const { rows } = await this.pg.query('SELECT id, url, alias, private, count FROM urls WHERE id=$1', [id])

      if (Array.isArray(rows) && !rows.length) {
        return NotFound(NOT_FOUND)
      }

      const row = rows.shift()

      if (row.private) {
        return NotFound(NOT_FOUND)
      }

      await this.redis[REDIS_NAMESPACE].set(hash, schema(pick(row, ['url', 'alias', 'private', 'count'])), 'ex', daysToSeconds(3))

      reply.code(302).redirect(row.url)
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}

const stats = async function (request, reply) {
  try {
    const { hash } = request.params

    const jsonString = await this.redis[REDIS_NAMESPACE].get(hash)

    if (jsonString) {
      const parsedJSON = parseJson(jsonString)

      if (parsedJSON.private) {
        return NotFound(NOT_FOUND)
      }

      reply.send({ count: parsedJSON.count })
    } else {
      const id = Base62.decode(hash)
      const { rows } = await this.pg.query('SELECT count FROM urls WHERE id=$1', [id])

      if (Array.isArray(rows) && !rows.length) {
        return NotFound(NOT_FOUND)
      }

      const row = rows.shift()

      if (row.private) {
        return NotFound(NOT_FOUND)
      }

      reply.send({ count: row.count })
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  stats,
  redirect
}
