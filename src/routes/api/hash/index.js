const { hashController } = require('../../../controllers')

const hashRoutes = async (app, options) => {
  app.get('/:hash', { pg: { transact: true } }, hashController.redirect)
}

module.exports = hashRoutes
