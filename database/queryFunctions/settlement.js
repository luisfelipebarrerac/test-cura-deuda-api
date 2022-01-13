//#region File Dependencies 
const knex = require('./knex');
const table = 'settlement';
//#endregion

//#region Settlement Query Functions
const insert = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table).insert(data)
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getByCp = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({d_codigo: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getByName = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({d_asenta: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};
//#endregion

//#region Module Exports
module.exports = {
  insert,
  getByCp,
  getByName,
};
//#endregion