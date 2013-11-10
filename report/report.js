var x = 10;
var y = 10;
var canvasW = 800;
var canvasH = 600;

var chartW = 200;
var chartH = 200;

var timerId;

function init() {
	getData();
}

$(init);

function getData(callback) {
	$.get('/data', function(data, response, jqXHR) {
		renderChart(JSON.parse(data));
		console.log('got response from server');
	});
}

function getVotes(items) {
	var scores = [];
	for (var i = items.length - 1; i >= 0; i--) {
		var item = items[i];
		scores.push(item.vote);
	};
	return scores;
}

function renderChart(scores) {
	console.log(scores);
	timerId = setTimeout(getData, 1000);
}