
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var item = require('./routes/item');
var http = require('http');
var path = require('path');
var db = require('./models');

var app = express();

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

// Root route
app.get('/', routes.index);

// Users
app.get('/users', user.list);

// Items
app.get('/items', item.index);
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
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
      })
    }
  })

  
