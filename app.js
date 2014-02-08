
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
authenticate = passport.authenticate('bearer', { session: false })
app.get('/items', authenticate, item.index);
app.post('/items', authenticate, item.create);
app.put('/items/:id', authenticate, item.update);
app.delete('/items/:id', authenticate, item.destroy);

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

  
