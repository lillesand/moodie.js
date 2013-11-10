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
	timerId = setTimeout(getData, 1000);
}

function getVoteCountForScore(votes, score) {
	return _.countBy(votes, function(vote) { return vote.vote === score; }).true;
}

function renderChart(items) {
	var lowScores = getVoteCountForScore(items, 1);
	var mediumScores = getVoteCountForScore(items, 2);
	var highScores = getVoteCountForScore(items, 3);

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
}