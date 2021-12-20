const knex = require('./knex');
const table = 'state';

module.exports.insert = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table).insert(data)
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

module.exports.getByCode = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('id')
      .where({c_estado: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

