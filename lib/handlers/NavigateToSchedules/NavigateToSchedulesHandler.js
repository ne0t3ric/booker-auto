const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')

class NavigateToSchedulesHandler extends BaseHandler {
  constructor(options) {
    super(options)

    this.goToSchedulesSelector = config.schedulesButton.selector
  }

  async execute(page) {
    // Navigate to schedules
    const selector = this.goToSchedulesSelector
    await page.click(selector)
  }
}

module.exports = NavigateToSchedulesHandler