
var mongoose = require ("mongoose")
  , uristring = require('../../config/config').db.URL
  , Item = require('../../models/item').Item

exports.setUp = function(done) {
  mongoose.connect(uristring, function (err, res) {
	  if (err) {
	    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	  } else {
	  	items = [
	  		{name: "Do groceries"},
	  		{name: "Get some milk"},
	  		{name: "Don't forget the coffee"}
	  	]
	  	Item.create(items, function(err) {
			done()
	  	})
	  }
  });
}

exports.tearDown = function(done) {
  Item.remove({}, function(err) {
  	mongoose.disconnect(function() {
  	  done()
    })
  })
}