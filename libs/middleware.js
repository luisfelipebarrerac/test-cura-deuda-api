//#region File Dependencies 
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../config');
const db = require('../database/queryFunctions');
const responseThrower = require('./response-thrower.js').responseThrower;
//#endregion

//#region Middleware route validation
const routesValidator = (routes) => {
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
//#endregion

//#region Middleware token validation
const tokenValidator = (req, res, next) => {
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
//#endregion

//#region Middleware Functions
const storageInit = (req, res, next) => {
  req.storage = {};
  next();
};
//#endregion

//#region Module Exports
module.exports = {
  storageInit,
  tokenValidator,
  routesValidator,
};
//#endregion