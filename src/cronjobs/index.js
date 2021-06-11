const {
  REDIS_NAMESPACE
} = require('../environment')
const { Base62 } = require('../utils')
const parseJson = require('parse-json')

const updateCounter = async (app) => {
  try {
    const keys = await app.redis[REDIS_NAMESPACE].keys('*')
    const values = await app.redis[REDIS_NAMESPACE].mget(keys)
    const objs = Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]))

    for (const [key, val] of Object.entries(objs)) {
      const id = Base62.decode(key)
      const parsedJSON = parseJson(val)
      const { count } = parsedJSON

      app.pg.query('UPDATE urls SET count=$1 WHERE id=$2', [count, id], (err, result) => {
        err ? app.log.error(err) : app.log.info(`The id: ${id} is updated sucessfully`)
      })
    }
  } catch (err) {
    app.log.error(err)
  }
}

module.exports = updateCounter
