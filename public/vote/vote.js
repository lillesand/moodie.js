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
    var socket = io.connect(document.location.origin);
    socket.on('pulse', function (data) {
        $('#pulse').text(data.pulse);
    });

    socket.on('message', function(data) {
        var messageElement = $('<li></li>');
        messageElement.append($('<span class="chat-message"></span>').text(data.message));
        messageElement.append($('<span class="message-smiley"></span>').text(data.smiley));

        $('#messages').find('ul').prepend(messageElement);
    });


    var $messageInput = $('#message');
    var maxLength = $messageInput.attr('maxlength');
    $messageInput.on('keyup', function() {
        var remaining = maxLength - $messageInput.val().length;
        $('.remaining').text(remaining);
    });
    $messageInput.trigger('keyup');

    $('#feedback').find('button').on('click', function(e) {
        e.preventDefault();
        var vote = $(this).data('vote-weight');
        var smiley = $(this).find('.smiley').text();
        var message = $messageInput.val();

        if (message.length == 0) {
            return;
        }

        $messageInput.val('').trigger('keyup');

        var data = {
            vote: vote,
            smiley: smiley,
            message: message
        };

        socket.emit('message', data);

        $('#feedback').slideUp();
        $('#waiting').slideDown();
        countdown({
            countdown: 10,
            iteration: function(time) {
                $('#number').text(time)
            },
            done: function() {
                $('#feedback').slideDown();
                $('#waiting').slideUp();
            }
        });
    });
});