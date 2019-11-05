#!/usr/bin/env node

//Get bin arguments
const [, , ...args] = process.argv


//imports
const schedule = require('node-schedule')
const cliArgumentsHelper = require('./cli-arguments-helper')
const defaultConfig = require('./../config')
const secureMinuteDelay = 1 //m
const childProcess = require('child_process');

function runScript(scriptPath, args, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath, args);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}



try {
    //Get bin arguments
    const cliParams = cliArgumentsHelper.extract(process.argv)

    //@TODO move screenshots as logger with singleton
    const params = Object.assign({}, defaultConfig.book, cliParams)

    //'2019-11-03T12:00' ISO 8601 format
    const now = new Date()
    const bookingDate = new Date(params.date)
    const minDate = new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(), 
        bookingDate.getDate() - params.delayBeforeBooking,
        bookingDate.getHours(),
        bookingDate.getMinutes() + secureMinuteDelay
    );

    const execute = function(date){
        runScript('./bin/cli-padel-booking.js', [ params.date ], function (err) {
            if (err) throw err;
            console.log('Finished running booking script');
        });
    }.bind(null, bookingDate)

    if (now < minDate){
        schedule.scheduleJob(minDate, execute)
    } else {
        execute()
    }


} catch (err) {
    console.log(err.message)
}