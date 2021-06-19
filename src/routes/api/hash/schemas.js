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

const updateSchema = {
  body: {
    type: 'object',
    properties: {
      private: { type: 'boolean' }
    },
    required: ['private'],
    errorMessage: {
      required: {
        private: 'private is required.'
      },
      properties: {
        private: 'private be match a boolean type.'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        updated: { type: 'boolean' },
        private: { type: 'boolean' }
      }
    }
  }
}

module.exports = {
  statsSchema,
  updateSchema
}
