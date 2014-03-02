var mongoose = require ("mongoose");

function Databases() {}

Databases.setUp = function() {
    // Setting up MongoDB and Mongoose
    // Here we find an appropriate database to connect to, defaulting to
    // localhost if we don't find one.
    var uristring = process.env.MONGOLAB_URI || 
                    process.env.MONGOHQ_URL ||
                    require('./config').db.URL;

    console.log(uristring);

    // The http server will listen to an appropriate port, or default to
    // port 5000.
    var theport = process.env.PORT || 5000;

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.connect(uristring, function (err, res) {
        /* istanbul ignore if */
        if (err) {
            console.log ('ERROR connecting to: ' + uristring + '. ' + err);
        } else {
            console.log ('Succeeded connected to: ' + uristring);
        }
    });
};

module.exports = Databases;
