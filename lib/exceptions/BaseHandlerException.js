class BaseHandlerException extends Error {
  constructor(message) {
    super(message)
    this.name = 'BaseHandlerException'
    this.message = message
  }
}

module.exports = BaseHandlerException