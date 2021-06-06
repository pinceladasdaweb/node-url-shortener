const {
  REDIS_NAMESPACE
} = require('../environment')
const boom = require('@hapi/boom')
const { INVALID_URI } = require('../errors')
const schema = require('./concerns/sjs-schema')
const { createUrlRegex } = require('@regex/url')
const { UnprocessableEntity } = require('http-errors')
const { daysToSeconds, pick, Base62 } = require('../utils')

const encode = async function (request, reply) {
  try {
    const { url, private: isPrivate = false } = request.body
    const rule = createUrlRegex()
    const isValidURI = rule.test(url)

    if (!isValidURI) {
      return UnprocessableEntity(INVALID_URI)
    }

    const { rows } = await this.pg.query("SELECT nextval(pg_get_serial_sequence('urls', 'id')) as next_id")
    const [{ next_id: nextId }] = rows
    const hash = Base62.encode(nextId)

    const {
      rows: insert
    } = await this.pg.query('INSERT INTO urls(id, url, alias, private) VALUES($1, $2, $3, $4) RETURNING *',
      [nextId, url, hash, isPrivate]
    )

    const row = insert.shift()

    await this.redis[REDIS_NAMESPACE].set(hash, schema(pick(row, ['url', 'alias', 'private', 'count'])), 'ex', daysToSeconds(3))

    reply.code(201).send(row)
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  encode
}
