//#region File Dependencies 
const knex = require('./knex');
//#endregion

//#region Global Variables
const table = 'city';
//#endregion

//#region City Query Functions
const insert = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table).insert(data)
      .then(function (result) {
        resolve(result);
      }, err => { reject(err); });
  });
};
//#endregion

//#region Module Exports
module.exports = {
  insert,
};
//#endregion