/**
 * @author Rube
 * @date 15/12/15
 */

var app = require('../index')();
var http = require('http');
var fs = require('fs');

app.use(function(next) {

    this.cookies.set('hello', 'me');
    this.state = {};
    this.state.number = 1;
    this.state['back'] = 'fibx';
    var a = next();
    if (a) {
        this.body = a + this.state.number;
    }
});

for (var i = 0; i < 1000; i++) {
    app.use(function(next) {
        this.state.number++;
        return next && next();
    });
}

app.use('^/all(/.*)$', function() {
    this.state.number = 'all';
    return 'hello world Rube~';
});

app.use('^/s.zip$', function() {
    var stream = fs.open(__dirname + '/simple-example.js');
    this.type = 'application/octet-stream';
    this.body = stream;
});

app.use('^/go(/.*)$', http.fileHandler('./'));

app.use('^/a(/.*)$', function(next) {
    this.state.number = -1;
    next();
});
app.use('^/a(/.*)$', function() {
    this.state.number = -2;
});

app.use('^(/.*)$', function() {
    this.state.number++;
});

app.listen(10023);
