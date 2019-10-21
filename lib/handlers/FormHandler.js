const BaseHandler = require('./BaseHandler')
const FormValidatorHandler = require('./FormValidator/FormValidatorHandler')

class FormHandler extends BaseHandler {
  constructor(options) {
    super(options)
  }

  async handleForm(page) {
    const form = this.getForm()

    if (form && !this.preventValidation()){
      const formValidator = new FormValidatorHandler(form)
      await formValidator.handle(page)
    }
  }

  getForm(){
    return this.form
  }
  
  preventValidation(){
    return false
  }
}

module.exports = FormHandler