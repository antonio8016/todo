
var Item = require('../models/item').Item; 

/*
 * GET items.
 */
exports.index = function(req, res){

	Item.find(function(err, users) {
    res.json(users)
  })

};

/*
 *	create item
 */
exports.create = function(req, res) {

	var name = req.body.name;

	Item.create({ name: name }).success(function(item) {
    res.json(item)
  })

};

/*
 *	edit item
 */
exports.update = function(req, res) {

	var name = req.body.name;
	var id = req.params.id;

	Item.find(id).success(function(item) {
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

	Item.find(id).success(function(item) {
		if (item) {
			item.destroy().success(function(){
				res.json(item);
			})
		} else {
			res.json({});
		}
	})

}


