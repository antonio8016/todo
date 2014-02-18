var mongoose = require('mongoose')
  , timestamps = require('mongoose-timestamp')
  , uniqueValidator = require('mongoose-unique-validator');

var itemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

itemSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

itemSchema.plugin(timestamps);
itemSchema.plugin(uniqueValidator);

exports.Item = mongoose.model('Item', itemSchema);
