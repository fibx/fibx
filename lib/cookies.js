/**
 * @author Rube
 * @date 15/12/16
 */
var http = require('http');
var md5 = require('hash').md5;

var cookies = {
    cookies: {
        get: function(name, option) {
            if (option && option.signed === false) {
                return getCookies.call(this, name);
            } else {
                return getSignedCookies.call(this, name);
            }
        },
        set: function(name, value, options) {
            var argv = Array.prototype.slice.call(arguments);
            if (options && options.signed === false) {
                setCookies.apply(this, argv);
            } else {
                setSignCookies.apply(this, argv);
            }
        }
    }
};

exports.init = function() {
    Object.assign(this, cookies);
};

exports.run = function(r) {
    this.cookies['r'] = r;
    this.cookies['key'] = this.key;
};

function setSignCookies(name, value, options) {
    var signValue = md5(md5(name + value).digest().hex() + this.key).digest().hex();
    setCookies.call(this, name, value, options);
    setCookies.call(this, name + '.sig', signValue, options);
};

function getSignedCookies(name) {

    var value = this.r.cookies[name];
    var signValue = this.r.cookies[name + '.sig'];
    if (signValue && value && md5(md5(name + value).digest().hex() + this.key).digest().hex() == signValue) {
        return value;
    } else {
        return null;
    }
};

function setCookies(name, value, options) {
    options = options || {};
    options['path'] = options['path'] || '/';
    options['httpOnly'] = options['httpOnly'] || true;
    this.r.response.addCookie(new http.Cookie(name, value, options));
};

function getCookies(name) {
    if (!!!this.r.cookies[name + '.sig']) {
        return this.r.cookies[name];
    } else {
        return null;
    }
};
