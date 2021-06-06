const statsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  }
}

module.exports = {
  statsSchema
}
