const BaseHandler = require('../BaseHandler')

class FormValidatorHandler extends BaseHandler{
  constructor(form){
    super()
    this.form = form
  }
  async handle(page) {
    const form = await page.$(this.form)
    await form.evaluate(form => form.submit())

    await page.waitForNavigation()

    await this.capture(page)
  }
}

module.exports = FormValidatorHandler