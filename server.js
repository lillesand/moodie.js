var express = require("express");
var _ = require('lodash');
var app     = express();
var port = process.env.PORT || 8080;

app.use(express.bodyParser());


var feedback = [];



// ROUTES
	
app.get('/', function(req, res) {
  res.end("Hello World");
});

app.post('/data', function(req, res) {
  var item = req.body;
  item.date = moment(new Date());
  feedback.push(item);
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


