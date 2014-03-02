var env = require('../config/config').env,
    request = require('request');

function Logger () {}

/* istanbul ignore next */
Logger.log = function(log) {

    // Log config
    //   a. dev: log to console
    //   b. test: no log
    //   c. prod: log to loggly

    if (env.production) {
        var body = {
            content: log
        };
        var options = {
            uri: 'https://logs.loggly.com/inputs/9e5005d2-f6ce-4c70-986f-90dc2dd99ee3' /*+ process.env.LOGGLY_INPUT_KEY*/,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        request.post(options, function (error, response, body) {
            console.log(response.statusCode);
            console.log(body);
        });    
    } else if (env.development) {
        console.log(log);
    } 

};

module.exports = Logger;
