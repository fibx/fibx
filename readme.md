#FibX

***

**fibx** 是 fibjs 的一个 web 框架,提供了中间件安装以及请求接受和应答的功能

##Installation
  
```
npm install fibjs-fibx
```

##Example     

```javascript
var app = require('fibjs-fibx')();
var http = require('http');

app.use(function(next) {

    this.cookies.set('hello', 'me');
    this.state = {};
    this.state.number = 1;
    this.state['back'] = 'fibx';
    next();
    this.body = 'hello world! ------' + this.state['back'] + 'number:' + this.state.number;
});

//设置1000个中间件
for (var i = 0; i < 1000; i++) {
    app.use(function(next) {
        this.state.number++;
        next && next();
    });
}

//app.use 的用法详见 Api Doc
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
```

##Api

[API Doc](https://github.com/fibx/fibx/blob/master/readme.md)
       
##Other          

如果你想写一个 fibjs 模块上传到 npm,必须像本项目在目录下放如 fibjs-install.js 的文件.							

```javascript			 
var fs = require('fs');
var os = require('os');
var process = require('process');

var modulesPath = '../../.modules';
var moduleName = JSON.parse(fs.readFile('package.json').toString()).name;

var isExists = fs.exists(modulesPath);
!isExists && fs.mkdir(modulesPath);

switch (os.type) {
    case 'Darwin':
        process.exec('ln -s ../node_modules/' + moduleName + ' ' + modulesPath + '/' + moduleName);
        break;
    default :
        process.exec('ln -s ../node_modules/' + moduleName + ' ' + modulesPath + '/' + moduleName);
}
```

然后在 package.json 中添加     
  
```json					
"scripts": {
    "install": "fibjs fibjs-install.js",
 }
```