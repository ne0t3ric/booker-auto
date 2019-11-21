class AdapterDate extends Date {
  constructor(...args) {
    super(...args)
    this.separator = '/'
  }
  getDigitMonth(){
    return ("0" + (this.getMonth() + 1)).slice(-2)
  }
  getDigitDate(){
    return ("0" + this.getDate()).slice(-2)
  }
  getDigitHours(){
    return ("0" + this.getHours()).slice(-2)
  }
  getDigitMinutes(){
    return ("0" + this.getMinutes()).slice(-2)
  }
  /*
  * DD/MM/YYYY
  */
  getDateWithoutHour(){
    return this.getDigitDate() + this.separator + this.getDigitMonth() + this.separator + this.getFullYear()
  }
  /*
  * HH:mm
  */
  getHoursMinutes(){
    return this.getDigitHours() + ':' + this.getDigitMinutes()
  }
}

module.exports = AdapterDate