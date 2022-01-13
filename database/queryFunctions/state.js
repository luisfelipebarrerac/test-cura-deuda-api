//#region File Dependencies 
const knex = require('./knex');
//#endregion

//#region Global Variables
const table = 'state';
//#endregion

//#region State Query Functions
const insert = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table).insert(data)
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getByCode = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('id')
      .where({c_estado: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getByName = async (data) => {
  return new Promise((resolve, reject) => {
    console.log('data :>> ', data);
    knex(table)
      .select('*')
      .where({d_estado: data})
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};

const getOneByName = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({d_estado: data})
      .then(function (result) {
        resolve(result[0]);
      }, err => { reject(err); });
  });
};

const getById = async (id) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({id})
      .then(function (result) {
        resolve(result[0]);
      }, err => { reject(err); });
  });
};
//#endregion

//#region Module Exports
module.exports = {
  insert,
  getByCode,
  getByName,
  getOneByName,
  getById,
};
//#endregion
