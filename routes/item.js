
var db = require('../models')

/*
 * GET items.
 */
exports.index = function(req, res){

	var item1 = { 
		name: "Milk" 
	};

	var item2 = {
		name: "Bread"
	};

	var items = [item1, item2];

  	// res.json(items);

	db.Item
		.all()
		.success(function(users) {
    		res.json(users)
    	})

};

/*
 *	create item
 */
exports.create = function(req, res) {

	var name = req.body.name;

	var item = {
		name : name
	};

	res.json(item);

};

/*
 *	edit item
 */
exports.update = function(req, res) {

	var name = req.body.name;
	var id = req.params.id;

	var item = {
		name : name,
		id: id
	};

	res.json(item);

};

/*
 *	Delete item
 */
exports.destroy = function(req, res) {

	var id = req.params.id;

	var item = {
		id: id
	};

	res.json(item);

}


