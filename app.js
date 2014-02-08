
/**
 * Module dependencies.
 */

var express = require('express')
  , controllers = require('./controllers')
  , user = require('./controllers/user')
  , item = require('./controllers/item')
  , http = require('http')
  , path = require('path')
  , db = require('./models')
  , io
  , app = express()
  , passport = require('passport')
  , BearerStrategy = require('passport-http-bearer').Strategy
  , request = require("request");

// Setting up the Authentication
// passport.use('provider', new OAuth2Strategy({
//     authorizationURL: 'http://oauth2server.herokuapp.com/oauth2/authorize',
//     tokenURL: 'http://oauth2server.herokuapp.com/oauth2/token',
//     clientID: 'e80cc842392d33e5a7731f78d44599a09f3505f30c2f4834cd5760070f1bc7d3',
//     clientSecret: '0b723f737d14c54f15c2cc553cb2e9f3455419f69d79d3ae738e4477a4c47a73'
//     callbackURL: 'http://www.google.com'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     done(err, {});
//   }
// ));

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
    callback = function(error, response, body) {
      token_info = JSON.parse(body)
      if (token_info.resource_owner_id) {
        console.log('Whooooop!' + token_info.resource_owner_id)
      } else {
        console.log('Noooooo!');
      }

      console.log(body)

      done(null, {"foo":body})
    }

    request(options, callback);

  }

));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Refactor structure
// http://stackoverflow.com/questions/5178334/folder-structure-for-a-nodejs-project

// Refactor controllers
// http://benedmunds.com/2012/04/19/simple-nodejs-express-mvr-template/
// Root route
app.get('/', controllers.index);

// Users
app.get('/users', user.list);

// Items
app.get('/items', passport.authenticate('bearer', { session: false }), item.index);
app.post('/items', item.create);
app.put('/items/:id', item.update);
app.delete('/items/:id', item.destroy);

// Setting up the database
db
  .sequelize
  .sync({ force: false })
  .complete(function(err) {
    if (err) {
      	console.log(err)
    } else {

      	var server = http.createServer(app)
      	server.listen(app.get('port'), function() {
        	console.log('Express server listening on port ' + app.get('port'))
      	})

      	// Refactor sockets
      	// http://stackoverflow.com/questions/12500922/nodejs-include-socket-io-in-router-page
      	// http://stackoverflow.com/questions/18856190/use-socket-io-inside-a-express-routes-file
      	io = require('socket.io').listen(server)

      	io.sockets.on('connection', function (socket) {
  			socket.emit('news', { hello: 'world' });

  			// Item resource
  			socket.on('list_items', function (data) {
    			db.Item.all().success(function(users) {
    			   socket.emit('list_items', JSON.stringify(users));
   	 			});
  			});

  			socket.on('create_item', function(data) {
  				db.Item.create({ name : data.body.name }).success(function(item) {
              socket.emit('create_item', JSON.stringify(item));
          })
  			});
  			
        socket.on('edit_item', function(data) {
  				console.log('edit_item');
  			});
      	
        socket.on('destroy_item', function(data) {
      			console.log('destroy_item');
      	});

		});

		io.sockets.on('disconnect', function (socket) {
    		socket.emit('user disconnected');
  		});

    }

})

  
