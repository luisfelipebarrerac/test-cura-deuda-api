//#region File Dependencies 
const fs = require('fs');
const path = require('path');
//#endregion

//#region Config File Build
let tempConfig = {
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

let st = JSON.stringify(tempConfig, null, '  ');
let st2 = `module.exports = ${st};`;
// eslint-disable-next-line no-undef
fs.writeFile(path.join(__dirname, '../') + 'config.js', st2, function () {});
//#endregion