var fs = require('fs');
var os = require('os');
var process = require('process');

var mName = JSON.parse(fs.readFile('package.json').toString()).name;
var mInfo= /(@.*)\/(.*)/.exec(mName);
var mPath = mInfo.length ? `../../../.modules/${mInfo[1]}` : `../../.modules`;
var execStr = mInfo.length ? `ln -s ../../../node_modules/${mName} ${mPath}/${mInfo[2]}` : `ln -s ../../node_modules/${mName} ${mPath + mName}`;

var isExists = fs.exists(mPath);
!isExists && process.exec(`mkdir -p ${mPath}`);

switch (os.type) {
    case 'Linux':
    case 'Darwin':
        process.exec(execStr);
        break;
    case 'Windows':
        break;
    default :
        process.exec(execStr);
}
