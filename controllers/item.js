
var Item = require('../models/item').Item; 

/*
 * GET /items
 */
exports.index = function(req, res){
  Item.find(function(err, items) {
  	// socket.emit('list_items', JSON.stringify(items));
	res.json(items)
  })
};

/*
 * GET /items/:id
 */
exports.show = function(req, res) {
  Item.findById(req.params.id, /*'name -_id',*/ function(err, item) {
    if (item) {
      res.json(item)
  	} else {
  	  res.statusCode = 404 // Not found!
  	  res.json({})
  	}
  })
};

/*
 *	POST /items
 */
exports.create = function(req, res) {
	var name = req.body.name;
    Item.create({ name: name }, function(err, item) {
    if (err) {
      res.statusCode = 409
      res.json(err)
    } else {
      res.json(item)
    }
  })
};

/*
 *	edit item
 */
exports.update = function(req, res) {

	var name = req.body.name;
	var id = req.params.id;
	
	Item.findById(id, function(err, item) {
		/* istanbul ignore if */
  		if (err) {
  			res.statusCode = 400
  			res.json({})
  		} else {
			if (item.name == name) {
				res.statusCode = 304 // Not modified
				res.json({})
			} else {
				item.name = name
				item.save(function(err) {
				    res.json(item)
			    })
			}
		}
	})
};

/*
 *	Delete item
 */
exports.destroy = function(req, res) {

	var id = req.params.id;

	Item.remove({_id : id}, function(err, item) {
		if (err || !item) {
			res.statusCode = 400
			res.json({})
		} else {
			res.json(item)
		}
	})

	// Item.find(id).success(function(item) {
	// 	if (item) {
	// 		item.destroy().success(function(){
	// 			res.json(item);
	// 		})
	// 	} else {
	// 		res.json({});
	// 	}
	// })

}


