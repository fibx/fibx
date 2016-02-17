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
        this.status = 302;
        this.r.response.redirect(url);
    }
};

exports.init = function() {
    Object.assign(this, response);
};

exports.run = function(r) {

    if (this.body === false) {
        this.body = 'false'
    }
    this.body = this.body || '';
    this.status = this.status || 200;
    this.type = this.type || '';

    var res = r.response;
    res.status = this.status;

    if (this.type) {
        this.set('Content-Type', this.type);
    } else {
        this.set('Content-Type', 'text/html');
    }

    if (this.body.toString().toLowerCase().indexOf('stream') != -1 ||
        this.body.toString().toLowerCase().indexOf('file') != -1) {

        res.body = this.body;
        return;
    }

    switch (typeof this.body) {
        case 'number':
            this.body += '';
            break;
        case 'object':
            this.body = JSON.stringify(this.body);
            this.set('Content-Type', 'text/json');
            break;
        case 'boolean':
            this.body += '';
            break;
    }

    res.write(this.body);
};