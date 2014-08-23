var moodie = moodie || {};

/**
 * Holy molasses, this actually works. Don't touch it, it might fall apart.
 */
(function() {

    var feedback = [];

    //var renderLines2 = renderLines(feedback);
    //console.log(renderLines2);

    moodie.parseForLines = parseForLines;

    /**
     * Returns something like:
     {
        'lineLabels': ['1', '2', '3'],
        'timeIntervals': ['15:15', '15:17', '15:19'],
        'lineValues': {
            '1': [2, 0, 5],
            '2': [1, 3, 4],
            '3': [4, 0, 3]
        }
    }
     */
    function parseForLines(votes) {
        var timeIntervalInMinutes = 2;

        votes = _.sortBy(votes, 'date');

        var intervals = findIntervals(votes, timeIntervalInMinutes);
        var voteValues = _.sortBy(_.unique(_.pluck(votes, 'vote')));
        var lineValues = groupVotes(votes, voteValues, intervals, timeIntervalInMinutes);
        var readableIntervals = _.map(intervals, function(interval){ return interval.format('HH:mm'); });

        return {
            lineLabels: voteValues,
            timeIntervals: readableIntervals,
            lineValues: lineValues
        };
    }

    function groupVotes(votes, voteValues, intervals, timeIntervalInMinutes) {
        var lineValues = createLineValueArrays(voteValues, intervals);

        _.each(votes, function (vote) {
            var intervalIndexForVote;
            _.each(intervals, function (interval, index) {
                var voteTime = moment(vote.date);
                var nextInterval = interval.clone().add(timeIntervalInMinutes, 'minutes');
                if (voteTime.isBefore(nextInterval)) {
                    intervalIndexForVote = index;
                    return false;
                }
            });

            lineValues[vote.vote][intervalIndexForVote]++;
        });

        return lineValues;
    }

    function createLineValueArrays(voteValues, numberOfIntervals) {
        var lineValues = {};
        _.each(voteValues, function (voteValue) {
            lineValues[voteValue] = arrayOfZeroes(numberOfIntervals.length);
        });
        return lineValues;
    }

    function findIntervals(items, timeIntervalInMinutes) {
        var sortedDates = _.sortBy(_.pluck(items, 'date'));

        var firstTime = moment(sortedDates[0]);
        var lastTime = moment(sortedDates[items.length - 1]);

        var numberOfIntervals = lastTime.diff(firstTime, 'minutes') / timeIntervalInMinutes;
        if (numberOfIntervals > 50) {
            throw new Error('Oldest vote is too far away form newest for the given interval. Would have given ' + numberOfIntervals + ' intervals');
        }

        var intervals = [];
        var currentIntervalValue = firstTime;
        while (currentIntervalValue.isBefore(lastTime)) {
            intervals.push(currentIntervalValue);
            currentIntervalValue = currentIntervalValue.clone().add(timeIntervalInMinutes, 'minutes');
        }

        return intervals;
    }

    function arrayOfZeroes(size) {
        var array = [], i = 0;
        for(i; i < size; i++) {
            array[i] = 0;
        }
        return array;
    }

})();