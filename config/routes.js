var item = require('../controllers/item'),
    seed = require('../controllers/seed'),
    passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    request = require("request");

exports.setUp = function (app) {

    // Setting up the authorization strategy
    /* istanbul ignore next */
    passport.use(new BearerStrategy(
        function(token, done) {
            // Preparing the URL
            var options = {
                url: 'http://oauth2server.herokuapp.com/oauth/token/info',
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            };
            // Preparing the callback
            request(options, function(error, response, body) {
                token_info = JSON.parse(body);
                if (token_info.resource_owner_id) {
                    console.log('Authenticated!');
                    done(null, {"user_id":token_info.resource_owner_id});
                } else {
                    console.log('Not Authenticated!');
                    done(null, false);
                }
            });
        }
    ));

    // TODO: Seeding routes
    // if ('test' == app.get('env') /* staging? */ ) {
           app.head('/seeds', seed.info);
           app.post('/seeds', seed.create);
           app.delete('/seeds/:id', seed.destroy);
    //    }

	// Items
    authenticate = passport.authenticate('bearer', { session: false });
    app.get('/items', item.index);
    app.get('/items/:id', item.show);
    app.post('/items', item.create);
    app.put('/items/:id', item.update);
    app.patch('/items/:id', item.update);
    app.delete('/items/:id', item.destroy);

};