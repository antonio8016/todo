
/**
 * Module dependencies.
 */

var express = require('express')
  , controllers = require('./controllers')
  , user = require('./controllers/user')
  , item = require('./controllers/item')
  , http = require('http')
  , path = require('path')
  , io
  , app = express()
  , passport = require('passport')
  , BearerStrategy = require('passport-http-bearer').Strategy
  , request = require("request")
  , mongoose = require ("mongoose");

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

// Setting up MongoDB
// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = process.env.MONGOLAB_URI || 
                process.env.MONGOHQ_URL ||
                'mongodb://localhost/TodoItems';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

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
  	// Item.find({}, function(err, users) {
  	//   socket.emit('list_items', JSON.stringify(users));
  	// });
  });

  socket.on('create_item', function(data) {
  	// Item.create({ name : data.body.name }).success(function(item) {
   //    socket.emit('create_item', JSON.stringify(item));
   //  })
  });

  socket.on('edit_item', function(data) {
  	console.log('edit_item');
  });

  socket.on('destroy_item', function(data) {
  		console.log('destroy_item');
  });

	io.sockets.on('disconnect', function (socket) {
  		socket.emit('user disconnected');
	});

})

  
