
var item_seeds = require('../test/seeds/item');

function SeedsController () {}

/*
 * HEAD /seeds
 */
SeedsController.info = function(req, res) {
    res.statusCode = 200;
    res.write();
    res.end();
};

/*
 * POST /seeds
 */
SeedsController.create = function(req, res) {
    res.statusCode = 200;
    item_seeds.setUp(function() {
        res.write('{"id" : 12345 }');
        res.end();
    });
};

/*
 * DELETE /seeds/:id
 */
SeedsController.destroy = function(req, res) {
    res.statusCode = 200;
    res.write("");
    item_seeds.tearDown(function() {
        res.end();
    });
};

module.exports = SeedsController;
