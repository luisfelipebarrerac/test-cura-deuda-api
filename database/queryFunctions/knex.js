//#region File Dependencies 
const config = require('../../config');
//#endregion

//#region Knex Config
module.exports = require('knex')({
  client: 'mysql',
  connection: config.mysqldb,
});
//#endregion
