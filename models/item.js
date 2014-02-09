var mongoose = require('mongoose')

var itemSchema = new mongoose.Schema({
	name: String
});

var Item = mongoose.model('Item', itemSchema)

exports.Item = Item;