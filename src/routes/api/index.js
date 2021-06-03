const apiRoutes = async (app, options) => {
  app.get('/', async (request, reply) => {
    return {
      message: 'Node Url Shortener API is on fire'
    }
  })
}

module.exports = apiRoutes
