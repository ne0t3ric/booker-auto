const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')

class NavigateToLoginHandler extends BaseHandler {
  constructor(options) {
    super(options)

    this.startUrl = config.url
  }

  async execute(page) {
    const url = this.startUrl
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
  }
}

module.exports = NavigateToLoginHandler