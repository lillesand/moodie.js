function PulseServer(expressApp, io) {

    var pulse = '';

    expressApp.post('/pulse', function(req, res) {
        var secret = req.get('Authentication');
        var api_key = process.env.api_key || 'super secret password$$##[[';
        if (secret != api_key) {
            console.log('fu, wrong password: ' + secret);
            res.status(400).send('401', { error: 'nope, invalid auth' });
            return;
        }

        if (!req.body.pulse) {
            console.log('fu, no pulse ', req.body);
            res.status(400).send({ error: 'nope, no pulse' });
            return;
        }

        pulse = req.body.pulse;
        io.emit('pulse', { pulse: pulse });

        res.status(200).send();
    });

    expressApp.get('/pulse', function(req, res) {
        fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
            res.send(text);
        });
    });

    io.on('connection', function (socket) {
        socket.emit('pulse', { pulse: pulse });
    });
}

module.exports = PulseServer;