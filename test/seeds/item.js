
var mongoose = require ("mongoose")
  , uristring = require('../../config/config').db.URL
  , Item = require('../../models/item').Item

exports.setUp = function(done) {
    items = [
        {name: "Do groceries"},
        {name: "Get some milk"},
        {name: "Don't forget the coffee"}
    ];
    Item.create(items, function(err) {
        done();
    });
}

exports.tearDown = function(done) {
    Item.remove({}, function(err) {
        done();
    });
}
