const Tracer = require('./Tracer')
const config = require('./config')
const tracer = new Tracer(config)

module.exports = tracer