/**
 * @author Rube
 * @date 15/12/15
 */

var http = require('http');
var mq = require('mq');
var connect = require('./lib/connect');
var request = require('./lib/request');
var response = require('./lib/response');
var cookies = require('./lib/cookies');

var app = Application.prototype;

module.exports = Application;

function Application() {
    if (!(this instanceof Application)) return new Application();
    this.middlewares = {'all': []};
    this.connected = {};
    this.routing = {};
    request.init.call(this);
    cookies.init.call(this);
    response.init.call(this);
}

app.listen = function(port) {
    var that = this;
    for (var route in this.middlewares) {
        (function(route) {
            that.connected[route] = connect.call(that, that.middlewares['all'].concat(that.middlewares[route]));
            that.routing[route] = function(r) {
                that.handler.call(that, r, route);
            }
        })(route);
    }

    var svr = new http.Server(port, new mq.Routing(that.routing));
    svr.run();
};

app.use = function(middleware) {
    if (typeof middleware === 'function') {
        this.middlewares['all'].push(middleware);
    } else {
        var argv = Array.prototype.slice.apply(arguments);
        if (argv[1].toString().toLocaleLowerCase() === 'handler') {
            this.routing[argv[0]] = argv[1];
            return;
        }
        this.middlewares[argv[0]] = this.middlewares[argv[0]] || [];
        this.middlewares[argv[0]].push(argv[1]);
    }
};

app.handler = function(r, route) {
    this.r = r;
    request.run.call(this, r);
    cookies.run.call(this, r);
    this.connected[route].call(this);
    response.run.call(this, r);
};

app.key = 'fibx';