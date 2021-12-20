const fs = require('fs');
const path = require('path');

var tempConfig = {
  express: {
    endpoint: '<api endpoint>',
    hostname: 'localhost',
    port: '<port>',
  },
  mysqldb: {
    database: '<db name>',
    multipleStatements: true,
    host: '<db host>',
    user: '<db user>',
    password: '<db password>',
  },
  developerMode: true,
  secretKey: 'ñla8923e67f',
};

var st = JSON.stringify(tempConfig, null, '  ');
var st2 = `module.exports = ${st};`;
fs.writeFile(path.join(__dirname, '../') + 'config.js', st2, function () {});
