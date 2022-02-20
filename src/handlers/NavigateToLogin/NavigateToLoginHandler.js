const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const {waitTillHTMLRendered} = require('./../../util')

class NavigateToLoginHandler extends BaseHandler {
  constructor(options) {
    super(options)

    this.startUrl = config.url
  }

  async execute(page) {
    const url = this.startUrl
    await page.goto(url, {
      waitUntil: 'load'
    })

    await waitTillHTMLRendered(page)
  }
}

module.exports = NavigateToLoginHandler