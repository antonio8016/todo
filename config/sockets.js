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
        var itemCreate = 'v1::items::create';
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

    
        // Delete an item
        var itemDestroy = 'v1::items::destroy';
        socket.on(itemDestroy, function(data) {
            // Doing a fake request and response
            var req = Object.create(express.request);
            req.params = { id: data.id };

            var res = {
                json: function(data) {
                    socket.emit(itemDestroy, data);
                }
            };

            // Calling the ItemController
            ItemController.destroy(req, res);
        });

        // io.sockets.on('disconnect', function (socket) {
        //     socket.emit('user disconnected');
        // });

    });

};

/* istanbul ignore next */
module.exports = Sockets;
