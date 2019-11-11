const Tracer = require('./Tracer')
const config = require('./../../config')
const tracer = new Tracer(config.tracer)

module.exports = tracer