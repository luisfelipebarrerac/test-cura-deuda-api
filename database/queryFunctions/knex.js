const config = require('../../config');

module.exports = require('knex')({
  client: 'mysql',
  connection: config.mysqldb,
});
