const mapping = require('./../../config/querystring.json')

module.exports = {
  format(urlParameters){
    let result = {}
    for (let parameter in urlParameters){
      const keyMap = urlParameters[parameter]
      result[parameter] = mapping[parameter][keyMap] || keyMap
    }
    return result
  }
}