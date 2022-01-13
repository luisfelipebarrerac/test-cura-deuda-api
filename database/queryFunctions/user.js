//#region File Dependencies 
const knex = require('./knex');
const crypto = require('crypto');
//#endregion

//#region Global Variables
const table = 'user';
//#endregion

//#region User Query Functions
const getByUsername = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('*')
      .where({username: data})
      .then(function (result) {
        resolve(result[0]);
      }, err => { reject(err); });
  });
};

const validateUser = async (id, password) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('password', 'salt')
      .where({id})
      .then(async (result) => {
        const user = result[0];
        const shaPassword = await sha512(password, user.salt);
        resolve(user.password == shaPassword);
      }, err => { reject(err); });
  });
};
//#endregion

//#region Sha Strategy
const sha512 = async (password, salt) => {
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return value;
};
//#endregion

//#region Module Exports
module.exports =  {
  getByUsername,
  validateUser,
};
//#endregion
