var test = require('test');
var http = require('http');
var coroutine = require('coroutine');
var fs = require('fs');
var md5 = require('hash').md5;
var app = require('../index')();

coroutine.start(function() {

    /** fibx request **/
    app.use('^/request/basic$', function() {
        this.body = {
            method: this.method,
            keepAlive: this.keepAlive,
            path: this.path,
            protocol: this.protocol,
            ip: this.ip,
            port: this.port,
            length: this.length,
            type: this.type,
            host: this.host
        };
    });

    app.use('^/request/query$', function() {
        this.body = this.query;
    });

    app.use('^/request/form$', function() {
        this.body = this.form;
    });

    app.use('^/request/type$', function() {
        this.body = this.is('^text/xm[a-z]+$');
    });

    /** fibx cookies **/
    app.use('^/cookies/signed$', function() {
        if (this.query.c === 'get') {
            console.log(this.r.cookies.all('b'));
            console.log(this.r.cookies.all('b.sig'));
            this.body = this.cookies.get('b');
        }
        if (this.query.c === 'set') {
            this.cookies.set('b', 'papapa');
            this.body = 'papapa';
        }
    });

    app.use('^/cookies/nosigned$', function() {
        if (this.query.c === 'get') {
            this.body = this.cookies.get('a', {signed: false});
        }
        if (this.query.c === 'set') {
            this.cookies.set('a', 'papapa', {signed: false});
            this.body = 'papapa';
        }
    });


    /** fibx response **/
    app.use('^/response/number$', function() {
        this.body = 1;
    });

    app.use('^/response/string$', function() {
        this.body = 'hello';
    });

    app.use('^/response/object2json$', function() {
        this.body = {a: 1};
    });

    app.use('^/response/boolean$', function() {
        this.body = false;
    });

    app.use('^/response/stream$', function() {
        this.body = fs.openFile('./index.js');
    });

    app.use('^/response/status$', function() {
        this.status = 500;
        this.type = 'text/xml';
    });

    app.use('^/response/redirect$', function() {
        this.redirect('http://localhost:5210/response/number');
    });

    /** fibx middleware **/
    app.use('^/next$', function(next) {

        this.state = {};
        this.state.number = 1;
        next && next();
        this.body = 'number:' + this.state.number;
    });
    app.use('^/next$', function() {
        this.state.number++;
    });

    app.use('^/nextr$', function(next) {

        this.state = {};
        this.state.number = 1;
        this.body = next();
    });
    app.use('^/nextr$', function() {
        this.state.number += 10;
        return 'number:' + this.state.number;
    });

    app.use('^/nextp$', function(next) {

        this.state = {};
        this.body = next('hello Rube');
    });
    app.use('^/nextp$', function(value) {
        return value;
    });
    /** fibx basic **/
    app.use(function(next) {
        this.body = 'hello world';
        next && next();
    });
    app.use('^/fibx$', function() {
        this.body = 'hello a';
    });
    app.use('^/fileHandle/(.*)$', http.fileHandler('./'));
    app.use('/', function() {
        this.body = 'hello b';
    });
    app.listen(5210);
});
coroutine.sleep(100);
test.setup();

describe('-----------------------fibx----------------------\r\n', function() {

    describe('fibx basic', function() {

        it('fibx start and listen the port', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/');
            assert.equal(r.read().toString(), 'hello b');
        });

        it('fibx __all__ middleware execute', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/__all__');
            assert.equal(r.read().toString(), 'hello world');
        });

        it('fibx route middleware execute', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/fibx');
            assert.equal(r.read().toString(), 'hello a');
        });

        it('fibx fileHandler can be used', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/fileHandle/index.js');
            var text = fs.readFile('./index.js').toString();
            assert.equal(text, r.read().toString());
        });

        it('request is independent', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/response/status');
            assert.equal(r.headers.first('Content-Type'), 'text/xml');
            assert.equal(r.status, 500);

            var r = http.request('get', 'http://127.0.0.1:5210/response/number');
            assert.equal(r.status, 200);
        });
    });

    describe('fibx middleware', function() {

        it('multi middlewares', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/next');
            assert.equal(r.read().toString(), 'number:2');
        });

        it('fibx can receive post,get,and more', function() {
            var r1 = http.request('post', 'http://127.0.0.1:5210/next');
            var r2 = http.request('delete', 'http://127.0.0.1:5210/next');
            var r3 = http.request('put', 'http://127.0.0.1:5210/next');
            var r4 = http.request('get', 'http://127.0.0.1:5210/next');
            assert.equal(r1.read().toString(), 'number:2');
            assert.equal(r2.read().toString(), 'number:2');
            assert.equal(r3.read().toString(), 'number:2');
            assert.equal(r4.read().toString(), 'number:2');
        });

        it('next return value', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/nextr');
            assert.equal(r.read().toString(), 'number:11');
        });

        it('next pass value', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/nextp');
            assert.equal(r.read().toString(), 'hello Rube');
        });
    });

    describe('fibx request', function() {

        it('request basic', function() {
            var r = http.request('get', 'http://127.0.0.1:10023/request/basic');
            var res = {
                "method": "get",
                "keepAlive": true,
                "path": "/request/basic",
                "protocol": "HTTP/1.1",
                "ip": "127.0.0.1",
                "length": 0,
                "host": "127.0.0.1:5210"
            };
            var sure = JSON.parse(r.read().toString());
            assert.equal(typeof sure.port, 'number');
            delete sure.port;
            assert.equal(JSON.stringify(res), JSON.stringify(sure));
        });

        it('request query', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/request/query?hello=1&world=2');
            assert.equal(r.read().toString(), JSON.stringify({hello: "1", world: "2"}));
        });

        it('request form', function() {
            var r = http.post('http://127.0.0.1:5210/request/form', "hello=a&world=b", {"Content-Type": "application/x-www-form-urlencoded"});
            assert.equal(r.read().toString(), JSON.stringify({hello: "a", world: "b"}));
        });

        it('request type is/get', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/request/type', {"Content-Type": "text/xml"});
            var r1 = http.request('get', 'http://127.0.0.1:5210/request/type', {"Content-Type": "text/xm1"});
            assert.equal('false', r1.read().toString());
            assert.equal('true', r.read().toString());
        });
    });

    describe('fibx response', function() {

        function handler(resData, type, path) {
            app.handler({
                response: {
                    write: function(data) {
                        assert.equal(data, resData);
                    },
                    headers: {
                        set: function(k, v) {
                            if (typeof type === 'string') {
                                assert.equal(v, type);
                            } else {
                                assert.ok((v === type[0] || v === type[1]));
                            }
                        }
                    }
                },
                stream: {},
                headers: {}
            }, path);
        }

        it('response number', function() {
            handler(1, 'text/html', '^/response/number$');
        });

        it('response boolean', function() {
            handler('false', 'text/html', '^/response/boolean$');
        });

        it('response string', function() {
            handler('hello', 'text/html', '^/response/string$');
        });

        it('response object2json', function() {
            handler(JSON.stringify({a: 1}), ['text/html', 'text/json'], '^/response/object2json$');
        });

        it('response stream', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/response/stream');
            assert.equal(r.read().toString(), fs.readFile('./index.js', 'utf8').toString());
        });

        it('response redirect', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/response/redirect');
            assert.equal(r.read().toString(), 1);
        });

        it('response status and content-type', function() {
            var r = http.request('get', 'http://127.0.0.1:5210/response/status');
            assert.equal(r.headers.first('Content-Type'), 'text/xml');
            assert.equal(r.status, 500);
        });
    });

    describe('fibx cookies', function() {

        it('set signed cookie', function() {
            var value = 'Rube';
            var value_hex =md5(md5('bRube').digest().hex() + app.key).digest().hex();
            var r = http.get('http://127.0.0.1:5210/cookies/signed?c=get',{"cookie":"b=" + value + "; path=/; b.sig=" + value_hex + "; path=/;"});
            assert.equal(value, r.read().toString());
        });

        it('get signed cookie', function() {
            var r = http.get('http://127.0.0.1:5210/cookies/signed?c=set');
            assert.equal(r.cookies[0].value, r.read().toString());
        });

        it('set nosigned cookie', function() {
            var value = 'Rube';
            var r = http.get('http://127.0.0.1:5210/cookies/nosigned?c=get',{"cookie":"a=" + value + "; path=/;"});
            assert.equal(value, r.read().toString());
        });

        it('get nosigned cookie', function() {
            var r = http.get('http://127.0.0.1:5210/cookies/nosigned?c=set');
            assert.equal(r.cookies[0].value, r.read().toString());
        });
    });
});

test.run();
process.exit(0);
