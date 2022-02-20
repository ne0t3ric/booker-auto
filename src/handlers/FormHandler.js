const BaseHandler = require('./BaseHandler')
const FormValidatorSubmitAPIHandler = require('./FormValidator/FormValidatorSubmitAPIHandler')

class FormHandler extends BaseHandler {
  constructor(options) {
    super(options)

    this.formValidator = this.getFormValidator()
  }

  async handleForm(page) {
    const form = this.getForm()

    if (form && !this.preventValidation()){
      await this.formValidator.handle(page)
    }
  }

  getForm(){
    return ''
  }

  getFormValidator(){
    return new FormValidatorSubmitAPIHandler(this.getForm())
  }
  
  preventValidation(){
    return false
  }
}

module.exports = FormHandler