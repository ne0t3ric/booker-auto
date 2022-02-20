const config = require('./config.json')
const BaseHandler = require('../BaseHandler')

class NavigateToBookPageHandler extends BaseHandler {
  constructor(options) {
    super(options)

    this.goToSchedulesSelector = config.schedulesButton.selector
  }

  async execute(page) {
    // Navigate to schedules
    const selector = this.goToSchedulesSelector

    await Promise.all([
      page.click(selector),
      page.waitForNavigation({waitUntil: 'networkidle2'})
    ])

    await waitTillHTMLRendered(page)
  }
}

module.exports = NavigateToSchedulesHandler