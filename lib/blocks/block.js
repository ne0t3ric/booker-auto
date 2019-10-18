class Block {
  constructor(name, context, options){
    this.name = name
    this.context = context
    this.options = options
  }
  async capture(){
    const targetPath = this.options.capture.path + this.name + '.png'
    await this.context.screenshot({path: targetPath})
    console.log('logs capture :' + targetPath)
  }
  async execute(){
    await this.procedure()
  }
  async procedure(){

  }
}

module.exports = Block