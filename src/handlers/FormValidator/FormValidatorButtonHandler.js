const BaseHandler = require('../BaseHandler')
const {waitTillHTMLRendered} = require('./../../util')

class FormValidatorButtonHandler extends BaseHandler {
  constructor(form){
    super()
    this.form = form
    this.formButtonValidate = form + ' button[type="submit"]'
  }

  async handle(page) {
    await page.waitForSelector(this.formButtonValidate);

    await Promise.all([
      page.click(this.formButtonValidate),
      page.waitForNavigation({waitUntil: 'load'})
    ])

    await waitTillHTMLRendered(page)
    await this.capture(page)
  }
}

module.exports = FormValidatorButtonHandler