const config = require('./config.json')
// load .env file
require('dotenv').config()
const FormValidatorButtonHandler = require('./../FormValidator/FormValidatorButtonHandler')
const FormHandler = require('../FormHandler')

class LoginFormHandler extends FormHandler {
  constructor(options) {
    super(options)

    this.config = config
  }

  getForm(){
    return config.form.selector
  }

  getFormValidator(){
    return new FormValidatorButtonHandler(this.getForm())
  }

  async execute(page) {
    /**
     * issue https://github.com/GoogleChrome/puppeteer/issues/1648
     *
     * cant use loop...
     */
    const params = this.config

    const username = process.env.CREDENTIALS_SITE_USERNAME || params.user.value
    const password = process.env.CREDENTIALS_SITE_PASSWORD || params.password.value

    await page.type(params.user.selector, username);
    await page.type(params.password.selector, password);
  }
}

module.exports = LoginFormHandler