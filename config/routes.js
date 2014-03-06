var item = require('../controllers/item'),
    seed = require('../controllers/seed'),
    passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    request = require("request"),
    versioning = require('../lib/versioning');

function Routes () {}

Routes.setUp = function (app) {
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
    if ('development' == app.get('env')) {
        // Set authentication
    }
    authenticate = passport.authenticate('bearer', { session: false });

    //
    // app.get({path: '/items', version: 1}, item.index)
    //
    // https://github.com/visionmedia/express-resource
    // Magic for adding express methods --> https://github.com/visionmedia/express-resource/blob/master/index.js
    //
    // app.all('/items*', authenticate);
    app.resource('items', item);
    app.patch('/items/:id', /* authenticate, */ item.update); // Rails 4 style compatibility
    // versioning(app);
    // app.vget({'pathgr':'/items', 'version':1}, item.index);

};

module.exports = Routes;
