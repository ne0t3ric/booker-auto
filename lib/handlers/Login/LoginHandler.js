const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')

class LoginHandler extends BaseHandler {
  constructor(options) {
    super(options)

    this.config = config
  }

  async execute(page) {
    /**
     * issue https://github.com/GoogleChrome/puppeteer/issues/1648
     *
     * cant use loop...
     */
    const params = this.config
    await page.type(params.user.selector, params.user.value);
    await page.type(params.password.selector, params.password.value);

    const form = await page.$(params.form.selector)
    await form.evaluate(form => form.submit())

    await page.waitForNavigation()
  }
}

module.exports = LoginHandler