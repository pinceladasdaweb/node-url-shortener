const boom = require('@hapi/boom')
const { Base62 } = require('../utils')
const { INVALID_URI } = require('../errors')
const { createUrlRegex } = require('@regex/url')
const { UnprocessableEntity } = require('http-errors')

const encode = async (request, reply) => {
  try {
    const { url, private: isPrivate = false } = request.body
    const rule = createUrlRegex()
    const isValidURI = rule.test(url)

    if (!isValidURI) {
      return UnprocessableEntity(INVALID_URI)
    }

    const { rows } = await request.pg.query("SELECT nextval(pg_get_serial_sequence('urls', 'id')) as next_id")
    const [{ next_id: nextId }] = rows

    const {
      rows: insert
    } = await request.pg.query('INSERT INTO urls(id, url, alias, private) VALUES($1, $2, $3, $4) RETURNING *',
      [nextId, url, Base62.encode(nextId), isPrivate]
    )

    reply.code(201).send(insert.shift())
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  encode
}
