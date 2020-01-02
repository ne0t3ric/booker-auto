class ScheduleNotFoundException extends Error {
  constructor(message) {
    super(message)
    this.name = 'ScheduleNotFoundException'
    this.message = message
    this.statusCode = 100
  }
}

module.exports = ScheduleNotFoundException