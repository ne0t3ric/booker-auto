const childProcess = require('child_process')

function runNodeScript(scriptPath, args) {
  const childprocess = childProcess.spawn('node', [scriptPath, ...args], {
      detached: true,
      stdio: 'ignore'
  })

  childprocess.unref()
}

module.exports = runNodeScript