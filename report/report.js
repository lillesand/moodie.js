(function($) {
    var chart;
    var timerId;

    $(document).ready(init);

    function init() {

        var options = {
            height: getParameterByName('height') || 400,
            width: getParameterByName('width') || 400
        };

        var $canvas = _.template('<canvas id="barChart" width="<%= width %>" height="<%= height %>"></canvas>', options);
        $('body').html($canvas);

        var context = $("#barChart").get(0).getContext("2d");
        chart = new Chart(context);
        getData();
    }

    function getData() {
        $.get('/data', function(data) {
            renderBars(JSON.parse(data));
        });
        timerId = setTimeout(getData, 1000);
    }

    function getVoteCountForScore(votes, score) {
        return _.countBy(votes, function(vote) { return vote.vote === score; }).true;
    }

    function renderBars(items) {
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
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

})(jQuery);