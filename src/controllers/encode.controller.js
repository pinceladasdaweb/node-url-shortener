const {
  REDIS_NAMESPACE
} = require('../environment')
const boom = require('@hapi/boom')
const { pick, Base62 } = require('../utils')
const { INVALID_URI } = require('../errors')
const { createUrlRegex } = require('@regex/url')
const { sjs, attr } = require('slow-json-stringify')
const { UnprocessableEntity } = require('http-errors')

const encode = async function (request, reply) {
  try {
    const { url, private: isPrivate = false } = request.body
    const rule = createUrlRegex()
    const isValidURI = rule.test(url)

    if (!isValidURI) {
      return UnprocessableEntity(INVALID_URI)
    }

    const { rows } = await request.pg.query("SELECT nextval(pg_get_serial_sequence('urls', 'id')) as next_id")
    const [{ next_id: nextId }] = rows
    const hash = Base62.encode(nextId)

    const {
      rows: insert
    } = await request.pg.query('INSERT INTO urls(id, url, alias, private) VALUES($1, $2, $3, $4) RETURNING *',
      [nextId, url, hash, isPrivate]
    )

    const row = insert.shift()

    const stringify = sjs({
      url: attr('string'),
      alias: attr('string'),
      private: attr('boolean'),
      count: attr('number')
    })

    await this.redis[REDIS_NAMESPACE].set(hash, stringify(pick(row, ['url', 'alias', 'private', 'count'])), 'ex', 3 * 24 * 60 * 60)

    reply.code(201).send(row)
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  encode
}
