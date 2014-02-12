var mongoose = require('mongoose')
  , timestamps = require('mongoose-timestamp')
  , uniqueValidator = require('mongoose-unique-validator');

var itemSchema = new mongoose.Schema({
	  name: { type: String, required: true, unique: true }
})
itemSchema.plugin(timestamps)
itemSchema.plugin(uniqueValidator)

exports.Item = mongoose.model('Item', itemSchema)
