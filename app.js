
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , http = require('http')
  , path = require('path')
  , routes = require('./config/routes')
  , sockets = require('./config/sockets')
  , databases = require('./config/databases')
  , swagger = require('swagger-node-express')
  , models = require('./models/swagger');

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

//
// Setting up swagger
//
swagger.setAppHandler(app);
swagger.addModels(models);

// development only 
/* istanbul ignore next */
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Setting up the databases
databases.setUp();

// Setting up the routes
routes.setUp(app, swagger);

// Init the server
var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'))
});

// Setting up the sockets
sockets.setUp(app, server);

// If test
// Exporting the app and embedding the server too
app.server = server;
module.exports = app;
