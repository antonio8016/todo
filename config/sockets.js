var socketio = require('socket.io'),
    logger = ('../lib/logger');

/* istanbul ignore next */
exports.setUp = function (app, server) {

    var io = socketio.listen(server);

    io.sockets.on('connection', function (socket) {

        // Item resource
        socket.on('list_items', function (data) {
        
            // Item.find({}, function(err, users) {
            //   socket.emit('list_items', JSON.stringify(users));
            // });
        });

        socket.on('create_item', function(data) {
            // Item.create({ name : data.body.name }).success(function(item) {
            //    socket.emit('create_item', JSON.stringify(item));
        //  })
        });

        socket.on('edit_item', function(data) {
            console.log('edit_item');
        });

        socket.on('destroy_item', function(data) {
            console.log('destroy_item');
        });

        io.sockets.on('disconnect', function (socket) {
            socket.emit('user disconnected');
        });

    });

};
