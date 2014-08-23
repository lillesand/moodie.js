module.exports = MessageServer;

function MessageServer(expressApp, io) {

    var messages = [];

    io.on('connect', function(socket) {
        socket.on('message', function (message) {
            if (messages.length < 10) {
                messages.push(message);
            }
            io.emit('message', message);
        });

        socket.on('consume', function() {
            if (messages.length > 0) {
                io.emit('consumed', messages.shift());
            }
            else {
                io.emit('consumed-empty');
            }
        })
    });

}