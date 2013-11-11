var chart;
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
};

function getVoteCountForScore(votes, score) {
	return _.countBy(votes, function(vote) { return vote.vote === score; }).true;
};

function renderChart(items) {
	var lowScoreCount = getVoteCountForScore(items, 1);
	var mediumScoreCount = getVoteCountForScore(items, 2);
	var highScoreCount = getVoteCountForScore(items, 3);

	var data = {
		labels : [":(",":|",":)"],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : [lowScoreCount, mediumScoreCount, highScoreCount]
			}
		]
	};

	var options = {
		scaleOverride : true,
		scaleSteps : _.max([lowScoreCount, mediumScoreCount, highScoreCount]),
		scaleStepWidth : 1,
		scaleStartValue : 0,
		animation: false

	};

	chart.Bar(data, options);
};