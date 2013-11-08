var express = require("express");
var _ = require('lodash');
var moment = require('moment');
var fs = require('fs');
var app     = express();
var port = process.env.PORT || 1337;

app.use(express.bodyParser());


var feedback = [];

// ROUTES

app.get('/', function(req, res) {
	fs.readFile(__dirname + '/vote/vote.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.post('/data', function(req, res) {
	console.log('received request on /data');
  	var item = req.body;
  	item.date = moment(new Date());
  	feedback.push(item);
  	res.end();
});

app.get('/data', function(req, res) {
	console.log(feedback);
	res.end(JSON.stringify(feedback));
});

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + "/"));
  app.use(express.errorHandler({
	dumpExceptions: true, 
	showStack: true
  }));
  app.use(app.router);
});

app.listen(port);
console.log('Server running on port', port, '...');


