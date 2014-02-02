
var db = require('../models')

/*
 * GET items.
 */
exports.index = function(req, res){

	db.Item.all().success(function(users) {
    	res.json(users)
    })

};

/*
 *	create item
 */
exports.create = function(req, res) {

	var name = req.body.name;

	db.Item.create({ name: name }).success(function(item) {
    	res.json(item)
  	})

};

/*
 *	edit item
 */
exports.update = function(req, res) {

	var name = req.body.name;
	var id = req.params.id;

	db.Item.find(id).success(function(item) {
  		if (item) {
  			item.name = name;
  			item.save().success(function(){
  				res.json(item)
  			})
  		} else {
  			res.json({});
  		}
	})
};

/*
 *	Delete item
 */
exports.destroy = function(req, res) {

	var id = req.params.id;

	db.Item.find(id).success(function(item) {
  		if (item) {
  			item.destroy().success(function(){
  				res.json(item);
  			})
  		} else {
  			res.json({});
  		}
	})

}


