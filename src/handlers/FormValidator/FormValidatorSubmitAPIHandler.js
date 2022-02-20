const BaseHandler = require('../BaseHandler')

class FormValidatorSubmitAPIHandler extends BaseHandler{
  constructor(form){
    super()
    this.form = form
  }
  
  async handle(page) {
    const form = this.form
    await page.$eval(form, form => form.submit());

    await page.waitForNavigation()

    await this.capture(page)
  }
}

module.exports = FormValidatorSubmitAPIHandler