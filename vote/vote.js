$(document).ready(function() {
    $('button').on('click', function(e) {
        e.preventDefault();
        var vote = $(this).data('vote-weight');

        $.ajax({
            url: '/data',
            method: 'post',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({ vote: 2 }),
            accept: 'application/json'
        });
    });
});