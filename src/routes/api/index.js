const apiRoutes = async (app, options) => {
  app.register(require('./hash'))
  app.register(require('./encode'), { prefix: 'encode' })
  app.get('/', async (request, reply) => {
    return {
      message: 'Node Url Shortener API is on fire'
    }
  })
}

module.exports = apiRoutes
