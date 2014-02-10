var controllers = require('../controllers')
  , item = require('../controllers/item')
  , passport = require('passport')
  , BearerStrategy = require('passport-http-bearer').Strategy
  , request = require("request");

exports.setUp = function (app) {

	// Setting up the authorization strategy
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
	      token_info = JSON.parse(body)
	      if (token_info.resource_owner_id) {
	        done(null, {"user_id":token_info.resource_owner_id})
	      } else {
	        done(null, false)
	      }
	    });
	  }
	));

	app.get('/', controllers.index);

	// Items
	authenticate = passport.authenticate('bearer', { session: false })
	app.get('/items(.json)?', authenticate, item.index);
	app.post('/items(.json)?', item.create);
	app.put('/items/:id(.json)?', item.update);
	app.delete('/items/:id(.json)?', item.destroy);

}