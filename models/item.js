var mongoose = require('mongoose')
var timestamps = require('mongoose-timestamp')

var itemSchema = new mongoose.Schema({
	name: String
})
itemSchema.plugin(timestamps)

exports.Item = mongoose.model('Item', itemSchema)
