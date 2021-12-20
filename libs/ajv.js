/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
var Ajv = require('ajv');
var ajv = new Ajv({$data: true, useDefaults: true});
require('ajv-keywords')(ajv, ['formatMinimum', 'formatMaximum']);
var db = require('../database/queryFunctions');

ajv.ValidationError = Ajv.ValidationError;


ajv.addKeyword('validateUniqueness', {
  async: true,
  validate: (schema, data, parentSchema, currentPath, parentObject, propertyInParentObject, rootData) =>
    new Promise((resolve, reject) => {
      if (schema) {
        db.common.findObject(schema, data).then(
          (result) => {
            if (result) {
              resolve(true);
            } else {
              reject(
                new Ajv.ValidationError([
                  {
                    keyword: 'alreadyExists',
                    dataPath: '.' + schema.properties,
                    params: data[schema.properties],
                  },
                ])
              );
            }
          },
          (error) => {
            resolve(error, 500, {
              error: 'SomethingWrongInServer',
              params: error,
            });
          }
        );
      }
    }),
});

ajv.addKeyword('validateUniquenessUserName', {
  async: true,
  validate: (schema, data, parentSchema, currentPath, parentObject, propertyInParentObject, rootData) =>
    new Promise((resolve, reject) => {
      if (schema) {
        db.common.findObject2(schema, data).then(
          (result) => {
            if (result) {
              resolve(true);
            } else {
              reject(
                new Ajv.ValidationError([
                  {
                    keyword: 'alreadyExists',
                    dataPath: '.' + schema.properties,
                    params: data[schema.properties],
                  },
                ])
              );
            }
          },
          (error) => {
            resolve(error, 500, {
              error: 'SomethingWrongInServer',
              params: error,
            });
          }
        );
      }
    }),
});

ajv.addKeyword('validateExistence', {
  async: true,
  validate: (schema, data, parentSchema, currentPath, parentObject, propertyInParentObject, rootData) =>
    new Promise((resolve, reject) => {
      if (data && schema.table) {
        db.common.getById(data, schema.table).then(function (result) {
          if (result.totalFound > 0) {
            resolve(true);
          } else {
            reject(
              new Ajv.ValidationError([
                {
                  keyword: 'itemDoesNotExist',
                },
              ])
            );
          }
        });
      } else {
        console.log('Schema no provisto de tabla o propiedades.');
        resolve(true);
      }
    }),
});

module.exports = ajv;
