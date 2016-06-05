$(document).ready(function() {
    var quotes = new Array("foo", "bar", "baz", "chuck"),
    randno = quotes[Math.floor( Math.random() * quotes.length )];
    $('.quote').text( randno );
});
