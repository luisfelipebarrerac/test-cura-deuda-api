const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../config');
const db = require('../database/queryFunctions');
const responseThrower = require('./responseThrower.js').responseThrower;

exports.storageInit = (req, res, next) => {
  req.storage = {};
  next();
};

// Middleware for route validation
exports.routesValidator = (routes) => {
  return (req, res, next) => {
    // Verificar que la ruta existe
    let pathname = req._parsedUrl.pathname.split(/\d+/);
    pathname = pathname.reduce((a, b, index) => {
      return a + ':id' + (index - 1) + b;
    });
    if (routes.includes(pathname)) {
      next();
    } else {
      responseThrower(res, req.logId, 404, { keyword: 'incorrectRoute' });
    }
  };
};

// Middleware for token validation
exports.tokenValidator = (req, res, next) => {
  // check header or url parameters or post parameters for token
  if (req.headers && req.headers['refer']) {
    var t = req.headers['refer'].split('?token=%');
    t = t[1];
  }
  var token = req.query.token || req.headers['token'] || t;

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        const url = req._parsedUrl.pathname.split('/');
        url.splice(0, 2);
        url.splice(1, url.length);
        if (url == 'resetPassword') {
          //para validar la llave tempKey en unicamente la ruta resetPassword
          jwt.verify(token, config.tempKey, (err, decoded) => {
            if (err) {
              responseThrower(res, req.logId, 401, { error: 'invalidToken' });
            } else {
              req.decoded = decoded;
              db.logs.updatecreated_by(req.logId, decoded.id);
              var newToken = jwt.sign(
                {
                  id: decoded.id,
                  permissions: decoded.permissions,
                  client_id: decoded.client_id,
                  start: decoded.start,
                },
                config.secretKey,
                {
                  //var token = jwt.sign({}, config.secretKey, {
                  expiresIn: 3600, // expires in 1 hours
                }
              );
              res.append('Access-Control-Expose-Headers', 'newToken');
              res.append('newToken', newToken);
              next();
            }
          });
        } else {
          responseThrower(res, req.logId, 401, { error: 'invalidToken' });
        }
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        db.logs.updatecreated_by(req.logId, decoded.id);
        var newToken = jwt.sign(
          {
            id: decoded.id,
            permissions: decoded.permissions,
            client_id: decoded.client_id,
            start: decoded.start,
          },
          config.secretKey,
          {
            //var token = jwt.sign({}, config.secretKey, {
            expiresIn: 3600, // expires in 1 hours
          }
        );
        res.append('Access-Control-Expose-Headers', 'newToken');
        res.append('newToken', newToken);
        next();
      }
    });
  } else {
    responseThrower(res, req.logId, 401, { error: 'tokenNotProvided' });
  }
};

// Middleware for check permissions
exports.permissionsValidator = (req, res, next) => {
  if (req.decoded.type == 'api' || req.decoded.type === 'navigation-api') {
    next();
  } else {
    db.users
      .getRoleByUserId(req.decoded.id)
      .then((result) => {
        if (result) {
          if (result.is_active) {
            let permissions = {
              ...defaultPermissions,
            };
            if (result.is_verified) {
              permissions = JSON.parse(result.permissions);
              if (result.catalog) {
                permissions = {
                  ...permissions,
                  ...catalogPermissions,
                };
              }
              if (result.robot) {
                permissions = {
                  ...permissions,
                  ...robotsPermissions,
                };
              }
              if (result.management) {
                permissions = {
                  ...permissions,
                  ...managementPermissions,
                };
              }
              if (result.surveys) {
                permissions = {
                  ...permissions,
                  ...surveysPermissions,
                };
              }
              if (result.advertisement) {
                permissions = {
                  ...permissions,
                  ...advertisementPermissions,
                };
              }
            } else {
              permissions = { resetPassword: 'U' };
            }
            req.storage.permissions = permissions;
            if (permissions.all || isAllowed(req, permissions)) {
              next();
            } else {
              responseThrower(res, req.logId, 401, {
                error: 'invalidPermissions',
              });
            }
          } else {
            responseThrower(res, req.logId, 401, {
              error: 'invalidPermissions',
            });
          }
        } else {
          responseThrower(res, req.logId, 401, { error: 'invalidPermissions' });
        }
      })
      .catch(() => {
        responseThrower(res, req.logId, 401, { error: 'invalidPermissions' });
      });
  }
};

const methods = {
  POST: 'C',
  GET: 'R',
  PUT: 'U',
  DELETE: 'D',
};

function isAllowed(req, dbPermissions) {
  const url = req._parsedUrl.pathname.split('/'); // Array of url's parts
  url.splice(0, 2); // Array of url's parts (only from pathname to the end)
  url.splice(1, url.length);//=> only contains one element, the first part. ex. ['surveys']
  const permissions = dbPermissions; // Decoded permissions

  var auxPermissions = permissions; // Iteration over all permissions to find the url permission
  for (let index = 0; index < url.length; index++) {
    if (auxPermissions[url[index]]) {
      auxPermissions = auxPermissions[url[index]]; //contains the permission => ex. 'CRUD' 
    } else {
      return false;
    }
  }

  if (typeof auxPermissions != 'object') {
    // It means url is shortest than the permission tree
    return auxPermissions.includes(methods[req.method]); // true if it is permited 
  } else {
    return false;
  }
}

const robotsPermissions = {
  'monitoring': 'CR',
  'robots': 'CRUD',
  'maps': 'RD',
  'paths': 'CRUD',
  'navigating': 'C',
  'gestures': 'R',
  'agents': 'CRUD',
  'answers': 'C',
  'interactions': 'R',
  'campaign': 'R',
  'personal-data': 'RU',
};

const defaultPermissions = {
  myInfo: 'RU',
  users: 'R',
  resetPassword: 'U',
  alerts: 'R',
  roles: 'R',
  // 
  call:'CRUD'
};

const catalogPermissions = {
  catalog:'CRUD',
  specs: 'CRUD',
};

const managementPermissions = {
  users: 'CRUD',
};

const surveysPermissions = {
  surveys: 'CRUD',
  surveyStatistics:'CRUD'
};
const advertisementPermissions = {
  advertisements: 'CRUD',
  campaign:'CRUD',
  resolution:'CRUD',
  scene:'CRUD',
  screen:'CRUD',
  events:'CRUD'
};
