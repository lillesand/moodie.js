function countdown(opts) {
    opts = _.defaults(opts, {
        countdown: 30,
        iteration: function() {},
        done: function() {}
    });
    var time = opts.countdown;

    var recurse = function() {
        opts.iteration(time);

        if (time <= 0) {
            opts.done();
            return;
        }

        setTimeout(function() {
            time--;
            recurse();
        }, 1000)
    };

    recurse();
}

$(document).ready(function() {
    $('#voting').find('button').on('click', function(e) {
        e.preventDefault();
        var vote = $(this).data('vote-weight');

        $.ajax({
            url: '/data',
            method: 'post',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({ vote: vote }),
            accept: 'application/json'
        });

        $('#voting').slideUp();
        $('#waiting').slideDown();
        countdown({
            countdown: 15,
            iteration: function(time) {
                $('#number').text(time)
            },
            done: function() {
                $('#voting').slideDown();
                $('#waiting').slideUp();
            }
        });
    });
});