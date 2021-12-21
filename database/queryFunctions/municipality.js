const knex = require('./knex');
const table = 'municipality';

module.exports.insert = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table).insert(data)
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

module.exports.getByName = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({D_mnpio: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

module.exports.getByCode = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('id')
      .where({c_mnpio: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};