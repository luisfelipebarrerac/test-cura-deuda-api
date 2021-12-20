const knex = require('./knex');
const table = 'settlement';

module.exports.insert = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table).insert(data)
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

module.exports.getByCp = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({d_codigo: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

module.exports.getByName = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({d_asenta: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};