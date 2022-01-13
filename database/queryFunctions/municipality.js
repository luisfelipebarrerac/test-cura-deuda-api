//#region File Dependencies 
const knex = require('./knex');
const table = 'municipality';
//#endregion

//#region Municipality Query Functions 
const insert = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table).insert(data)
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getByName = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({D_mnpio: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getByCode = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({c_mnpio: data})
      .orderBy('id')
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getById = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({id: data})
      .orderBy('id')
      .then(function (result) {
        resolve(result[0]);
      }, err => { reject(err); });
  });
};

const getByStateId = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({state_id: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};
//#endregion

//#region Module Exports
module.exports = {
  insert,
  getByName,
  getByCode,
  getByStateId,
  getById,
};
//#endregion