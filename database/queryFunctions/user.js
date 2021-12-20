const knex = require('./knex');
const crypto = require('crypto');

const table = 'user';

const sha512 = (password, salt) => {
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return value;
};

exports.sha512 = sha512;

module.exports.getByUsername = async (data) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('id', 'password')
      .where({username: data})
      .then(function (result) {
        resolve(result[0]);
      }, err => { reject(err); });
  });
};

module.exports.validateUser = async (id, password) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .select('password', 'salt')
      .where({id: id})
      .then((result) => {
        const user = result[0];
        const shaPassword = sha512(password, user.salt);
        resolve(user.password == shaPassword);
      }, err => { reject(err); });
  });
};

