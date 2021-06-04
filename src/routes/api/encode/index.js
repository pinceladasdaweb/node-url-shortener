const { encodeSchema } = require('./schemas')
const { encodeController } = require('../../../controllers')

const encodeRoutes = async (app, options) => {
  app.post('/', { schema: encodeSchema, pg: { transact: true } }, encodeController.encode)
}

module.exports = encodeRoutes
