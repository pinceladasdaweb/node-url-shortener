const schema = require('./sjs-schema')
const { daysToSeconds, pick } = require('../../utils')

const updateCounter = async (redis, json) => {
  const { alias, count } = pick(json, ['alias', 'count'])

  const updatedJson = {
    ...json,
    count: Number(count) + 1
  }

  await redis.set(alias, schema(updatedJson), 'ex', daysToSeconds(3))

  return updatedJson
}

module.exports = updateCounter
