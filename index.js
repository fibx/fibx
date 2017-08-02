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
var methodCollection = {};

module.exports = Application;

function Application() {
    if (!(this instanceof Application)) return new Application();
    this.middlewares = {'__all__': []};
    this.nativeMiddlewares = [];
    this.connected = {};
    this.routing = {};
    request.init.call(methodCollection);
    cookies.init.call(methodCollection);
    response.init.call(methodCollection);
}

app.listen = function(port) {
    var that = this;
    for (var route in this.middlewares) {
        (function(route) {
            that.connected[route] = function(cxt) {
                return connect.call(cxt, that.middlewares['__all__'].concat(that.middlewares[route]));
            };
            that.routing[route] = function(r) {
                that.handler.call(that, r, route);
            }
        })(route);
    }

    var svr = new http.Server(port, this.nativeMiddlewares.concat(new mq.Routing(that.routing)));
    svr.run();
};

app.use = function(middleware) {
    if (middleware.toString().toLocaleLowerCase() === 'handler'){
        this.nativeMiddlewares.push(middleware);
        return;
    }

    if (typeof middleware === 'function') {
        this.middlewares['__all__'].push(middleware);
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
    var _r = Object.create({});
    Object.assign(_r, methodCollection);
    _r.r = r;
    _r.key = app.key;
    request.run.call(_r, r);
    cookies.run.call(_r, r);
    this.connected[route](_r).call(_r);
    response.run.call(_r, r);
};

app.key = 'fibx';