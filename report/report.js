var chart;

var x = 10;
var y = 10;
var canvasW = 800;
var canvasH = 600;

var chartW = 200;
var chartH = 200;

var timerId;

function init() {

	var context = $("#barChart").get(0).getContext("2d");
	chart = new Chart(context);
	getData();
}

$(init);

function getData(callback) {
	$.get('/data', function(data, response, jqXHR) {
		renderChart(JSON.parse(data));
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

function renderChart(items) {
	var lowScores = _.countBy(items, function(item) { return item.vote === 1; }).true;
	var mediumScores = _.countBy(items, function(item) { return item.vote === 2; }).true;
	var highScores = _.countBy(items, function(item) { return item.vote === 3; }).true;

	var data = {
	labels : [":(",":|",":)"],
	datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : [lowScores, mediumScores, highScores]
			}
		]
	}

	var options = {
		scaleOverride : true,
		scaleSteps : _.max([lowScores, mediumScores, highScores]),
		scaleStepWidth : 1,
		scaleStartValue : 0,
		animation: false

	};

	chart.Bar(data, options);
	timerId = setTimeout(getData, 1000);
}