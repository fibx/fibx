/**
 * @author Rube
 * @date 15/12/16
 */

var request = {
    get: function(field) {
        return this.r.headers[field];
    },
    is: function(type) {
        var reg = new RegExp(type);
        return reg.test(this.get('Content-Type'));
    }
};

exports.init = function() {
    Object.assign(this, request);
};

exports.run = function(r) {
    this.request = {};
    this.method = r.method;
    this.keepAlive = r.keepAlive;
    this.query = {};
    this.form = {};
    this.queryString = r.queryString;
    this.path = r.address;
    this.header = r.headers;
    this.protocol = r.protocol;
    if (r.socket) {
        this.ip = r.socket.remoteAddress;
        this.port = r.socket.remotePort;
    }
    this.length = r.length;
    this.type = this.get('Content-Type');
    this.host = this.get('Host');
    for (var key in r.query) {
        if (!(typeof r.query[key] == 'function')) {
            this.query[key] = r.query[key];
        }
    }
    for (var key in r.form) {
        if (!(typeof r.form[key] == 'function')) {
            this.form[key] = r.form[key];
        }
    }
};