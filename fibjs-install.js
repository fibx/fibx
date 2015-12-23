var fs = require('fs');
var os = require('os');
var process = require('process');

var modulesPath = '../../.modules';
var moduleName = JSON.parse(fs.readFile('package.json').toString()).name;

var isExists = fs.exists(modulesPath);
!isExists && fs.mkdir(modulesPath);

switch (os.type) {
    case 'Linux':
    case 'Darwin':
        process.exec('ln -s ../node_modules/' + moduleName + ' ' + modulesPath + '/' + moduleName);
        break;
    case 'Windows':
        break;
    default :
        process.exec('ln -s ../node_modules/' + moduleName + ' ' + modulesPath + '/' + moduleName);
}