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
            uri: 'https://logs.loggly.com/inputs/__USE_YOUR_KEY__' /*+ process.env.LOGGLY_INPUT_KEY*/,
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
