
var Item = require('../models/item').Item,
    HttpStatusCodes = require('../lib/http_status_codes'); 

function ItemsController () {}

ItemsController.id = 'id';

/*
 * GET /items
 */
ItemsController.index = function(req, res) {
    Item.find(function(err, items) {
        // socket.emit('list_items', JSON.stringify(items));
        res.statusCode = HttpStatusCodes.OK;
        res.json(items);
        console.log('here!');
        console.log(res);
    });
};

/*
 * GET /items/:id
 */
ItemsController.show = function(req, res) {
    Item.findById(req.params.id, /*'name -_id',*/ function(err, item) {
        if (item) {
            res.statusCode = HttpStatusCodes.OK;
            res.json(item);
        } else {
            res.statusCode = HttpStatusCodes.NOT_FOUND; // Not found!
            res.json({});
        }
    });
};

/*
 *	POST /items
 */
ItemsController.create = function(req, res) {
    var args = { name: req.body.name };
    Item.create(args, function(err, item) {
        if (err) {
            res.statusCode = HttpStatusCodes.CONFLICT;
            res.json(err);
        } else {
            res.json(item);
        }
    });
};

/*
 *	edit item
 */
ItemsController.update = function(req, res) {

    var name = req.body.name;
    var id = req.params.id;
	
    Item.findById(id, function(err, item) {
        /* istanbul ignore if */
        if (err) {
            res.statusCode = 400;
            res.json({});
        } else {
            if (item.name == name) {
                res.statusCode = 304; // Not modified
                res.json({});
            } else {
                item.name = name;
                item.save(function(err) {
                    res.json(item);
                });
            }
        }
    });
};

/*
 *	Delete item
 */
ItemsController.destroy = function(req, res) {

    var id = req.params.id;

    Item.remove({_id : id}, function(err, item) {
        if (err || !item) {
            res.statusCode = 400;
            res.json({});
		} else {
            res.json(item);
        }
    });

};

module.exports = ItemsController;
