const childProcess = require('child_process')

function runDeferScript(scriptPath, args) {

  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false

  const childprocess = childProcess.fork(scriptPath, args, {
      detached: true,
      stdio: 'ignore'
  })

  // listen for errors as they may prevent the exit event from firing
  childprocess.on('error', function (err) {
    if (invoked) return
    invoked = true
    process.exit(1)
  });

  // execute the callback once the process has finished running
  childprocess.on('exit', function (code) {
    if (invoked) return
    invoked = true
    process.exit(code)
  });

  childprocess.unref()
}

module.exports = runDeferScript