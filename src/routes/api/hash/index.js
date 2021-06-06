const { statsSchema } = require('./schemas')
const { hashController } = require('../../../controllers')

const hashRoutes = async (app, options) => {
  app.get('/:hash', { pg: { transact: true } }, hashController.redirect)
  app.get('/:hash/stats', { schema: statsSchema, pg: { transact: true } }, hashController.stats)
}

module.exports = hashRoutes
