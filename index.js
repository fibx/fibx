/**
 * @author Rube
 * @date 15/12/15
 */

var http = require('http');
var connect = require('./lib/connect');
var request = require('./lib/request');
var response = require('./lib/response');
var cookies = require('./lib/cookies');

var app = Application.prototype;

module.exports = Application;

function Application() {
    if (!(this instanceof Application)) return new Application();
    this.middlewares = [];
    request.init.call(this);
    cookies.init.call(this);
    response.init.call(this);
}

app.listen = function(port) {
    var that = this;
    this.connected = connect.call(this);
    var svr = new http.Server(port, function(r) {
        that.handler.call(that, r);
    });
    svr.run();
};

app.use = function(middleware) {
    this.middlewares.push(middleware);
};

app.handler = function(r) {
    this.r = r;
    request.run.call(this, r);
    cookies.run.call(this, r);
    this.connected.call(this);
    response.run.call(this, r);
};

app.key = 'fibx';