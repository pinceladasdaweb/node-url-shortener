const { sjs, attr } = require('slow-json-stringify')

module.exports = sjs({
  url: attr('string'),
  alias: attr('string'),
  private: attr('boolean'),
  count: attr('number')
})
