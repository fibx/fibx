/**
 * @author Rube
 * @date 15/12/15
 */

var app = require('../index')();
var http = require('http');

app.use(function(next) {

    this.cookies.set('hello', 'me');
    this.state = {};
    this.state.number = 1;
    this.state['back'] = 'fibx';
    next();
    this.body = 1;
});

for (var i = 0; i < 1000; i++) {
    app.use(function(next) {
        this.state.number++;
        next && next();
    });
}

app.use('^/all(/.*)$', function(){
    this.state.number = 'all';
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
