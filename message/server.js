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
    })

}