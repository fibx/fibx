/**
 * @module
 * @author Rube
 * @date 15/12/16
 * @desc
 */

var response = {
    set: function(field, value) {
        if (typeof field == 'string') {
            this.r.response.headers.set(field, value);
        } else {
            for (var f in field) {
                this.r.response.headers.set(f, field[f]);
            }
        }
    },
    remove: function(field) {
        this.r.response.headers.remove(field);
    },
    redirect: function(url) {
        this.r.response.redirect(url);
    }
};

exports.init = function() {
    Object.assign(this, response);
};

exports.run = function(r) {
    this.body = this.body || '';
    this.status = this.status || 200;
    this.type = this.type || '';

    var res = r.response;
    res.status = this.status;
    this.type && this.set('Content-Type', this.type);
    res.write(this.body);
};