const responseSchema = {
  url: { type: 'string' },
  alias: { type: 'string' },
  private: { type: 'boolean' },
  count: { type: 'number' },
  created_at: { type: 'string' }
}

const bodySchema = {
  type: 'object',
  properties: {
    to: {
      url: 'string',
      format: 'uri'
    },
    private: { type: 'boolean' }
  },
  required: ['url'],
  errorMessage: {
    required: {
      url: 'url is required.'
    },
    properties: {
      private: 'private be match a boolean type.'
    }
  }
}

const encodeSchema = {
  body: bodySchema,
  response: {
    201: {
      type: 'object',
      properties: responseSchema
    }
  }
}

module.exports = {
  encodeSchema
}
