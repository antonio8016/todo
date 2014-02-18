
var item_seeds = require('../test/seeds/item');

/*
 * HEAD /seeds
 */
exports.info = function(req, res) {
    res.statusCode = 200;
    res.write("");
    res.end();
};

/*
 * POST /seeds
 */
exports.create = function(req, res) {
    res.statusCode = 200;
    res.write("");
    item_seeds.setUp(function() {
        res.end();
    });
};

/*
 * DELETE /seeds
 */
exports.destroy = function(req, res) {
    res.statusCode = 200;
    res.write("");
    item_seeds.tearDown(function() {
        res.end();
    });
};
