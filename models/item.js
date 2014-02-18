var mongoose = require('mongoose')
  , timestamps = require('mongoose-timestamp')
  , uniqueValidator = require('mongoose-unique-validator')
  , ShortId = require('mongoose-shortid');;

var itemSchema = new mongoose.Schema({
    _id: {
        type: ShortId,
        len: 14,
        alphabet: '0123456789'
    },
    name: { 
        type: String, 
        required: true, 
        unique: true 
    }
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
