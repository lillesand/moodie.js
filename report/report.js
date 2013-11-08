var r;


var x = 10;
var y = 10;
var canvasW = 800;
var canvasH = 600;

var chartW = 200;
var chartH = 200;

var timerId;

function init() {
	r = Raphael(x, y, canvasW, canvasH);
	getData();
}

$(init);

function groupScoresPerMinute(scores) {
	_.groupBy(scores, function(score) {
		return score.date.format('hh:mm');
	});
}

function getData(callback) {
	$.get('/data', function(data, response, jqXHR) {
		callback(getVotes(JSON.parse(data)));
		//console.log('got response from server');
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
	//console.log(scores);
	var chart = r.barchart(x, y, chartW, chartH, scores, { stacked: false });
	$('.bad').text('Bad reviews: ', _.)
	//chart.label([1,2,3]);
	timerId = setTimeout(getData, 1000);
}