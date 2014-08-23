var express = require("express"),
    _ = require('lodash'),
    moment = require('moment'),
    fs = require('fs'),
    PulseServer = require('./pulse/server'),
    MessageServer = require('./message/server'),
    bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());
app.use('/public', express.static('public'));

var io = require('socket.io')(server);
var pulseServer = new PulseServer(app, io);
var messageServer = new MessageServer(app, io);

var port = process.env.PORT || 1337;


var feedback = [{"vote":1,"date":"2013-11-10T13:57:00.067Z"},
                     {"vote":1,"date":"2013-11-10T13:58:12.067Z"},
                     {"vote":3,"date":"2013-11-10T13:56:42.067Z"},
                     {"vote":3,"date":"2013-11-10T13:53:19.067Z"},
                     {"vote":2,"date":"2013-11-10T13:56:52.067Z"},
                     {"vote":3,"date":"2013-11-10T13:52:48.067Z"},
                     {"vote":1,"date":"2013-11-10T13:56:53.067Z"},
                     {"vote":3,"date":"2013-11-10T13:51:37.067Z"},
                     {"vote":2,"date":"2013-11-10T13:54:55.067Z"},
                     {"vote":2,"date":"2013-11-10T13:56:47.067Z"},
                     {"vote":3,"date":"2013-11-10T13:57:35.067Z"},
                     {"vote":2,"date":"2013-11-10T13:56:25.067Z"},
                     {"vote":1,"date":"2013-11-10T13:55:20.067Z"}
];
// comment the line below to enable dummy feedback data for testing
var feedback = [];


// ROUTES
app.get('/', function(req, res) {
	fs.readFile(__dirname + '/public/vote/vote.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.post('/data', function(req, res) {
  	var vote = req.body.vote;

    if ([1,2,3].indexOf(vote) == -1) {
        console.log('invalid vote: ' + vote);
        return;
    }

    console.log('received vote: ' + vote);

  	feedback.push({
        vote: vote,
        date: moment(new Date())
    });
  	res.end();
});

app.get('/data', function(req, res) {
	res.end(JSON.stringify(feedback));
});


app.use(function(req, res, next){
    console.log('Not found:', req.path, '(', req.method, ')');
    res.status(404).send('Not found.');
});

server.listen(port, function() {
    console.log('Server running on port', port, '...');
});



