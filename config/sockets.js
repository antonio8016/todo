var socketio = require('socket.io'),
    logger = ('../lib/logger'),
    Item = require('../models/item').Item,
    ItemController = require('../controllers/item'),
    express = require('express');

function Sockets () {}

Sockets.setUp = function (app, server) {

    var io = socketio.listen(server);

    io.sockets.on('connection', function (socket) {

        //
        // Item resource
        //

        // Returns all items
        var itemIndex = 'v1::items::index';
        socket.on(itemIndex, function (data) {

            // Doing a fake request and response
            var req = Object.create(express.request);
            var res = {
                json: function(data) {
                    socket.emit(itemIndex, data);
                }
            };

            // Calling the ItemController
            ItemController.index(req, res);

        });

        // Create an item
        var itemCreate = 'v1::item::create';
        socket.on(itemCreate, function(data) {

            // Doing a fake request and response
            var req = Object.create(express.request);
            req.body = data;

            var res = {
                json: function(data) {
                    socket.emit(itemCreate, data);
                }
            };

            // Calling the ItemController
            ItemController.create(req, res);

        });

        // socket.on('edit::item', function(data) {
        //     console.log('edit_item');
        // });

        // socket.on('destroy::item', function(data) {
        //     console.log('destroy_item');
        // });

        // io.sockets.on('disconnect', function (socket) {
        //     socket.emit('user disconnected');
        // });

    //     app.io.route('items', {
    //         create: function(req) {
    //             console.log('Creating an item...');
    //         },
    //         update: function(req) {
    //             console.log('Updating an item...');
    //         },
    //         remove: function(req) {
    //             console.log('Removing an item...');
    //         },
    //     });

    });

    // app.io.route('items', {
    //     index: function(req) {
    //         console.log('Returning items...');
    //     },
    //     create: function(req) {
    //         // create your customer
    //     },
    //     update: function(req) {
    //         // update your customer
    //     },
    //     remove: function(req) {
    //         // remove your customer
    //     },
    // });

};

/* istanbul ignore next */
module.exports = Sockets;
