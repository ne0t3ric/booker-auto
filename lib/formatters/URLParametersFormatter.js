class URLParametersFormatter {
  constructor(mapping){
    this.mapping = mapping || {}
  }
  format(urlParameters){
    const mapping = this.mapping
    let result = {}
    for (let parameter in urlParameters){
      if (urlParameters.hasOwnProperty(parameter)) {
        const keyMap = urlParameters[parameter]

        result[parameter] = ('undefined' !== typeof mapping[parameter]) ? mapping[parameter][keyMap] : keyMap
      }
    }
    return result
  }
}


module.exports = URLParametersFormatter