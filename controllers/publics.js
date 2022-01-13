//#region File Dependencies 
const express = require('express');
const db = require('../database/queryFunctions');
const Ajv = require('ajv');
const ajv = new Ajv();
const config = require('../config');
var jwt = require('jsonwebtoken'); 
const responseThrower = require('../libs/response-thrower.js').responseThrower;
const {publicAuthSchema} = require('../schemas/routes-schemas');
const router = express.Router();
//#endregion

//#region Global Variables
const tokenExpire = { expiresIn: 28800 };
const key = config.secretKey;
const InvalidCredentialsMessage = { error: 'InvalidCredentials' };
//#endregion

//#region Publics Controller
router.post('/authenticate', async (req, res) => {
  const data = req.body;
  try {
    await ajv.validate(publicAuthSchema, data);
    const { user, password } = data;
    const {id, username} = await db.user.getByUsername(user);
    if(username){
      const isValidated = await db.user.validateUser(id, password);
      if(isValidated){
        const singOptions = {
          id,
          username
        };
        const token = jwt.sign(
          singOptions,
          key,
          tokenExpire,
        );
        responseThrower(res, req.logId, 200, {
          message: 'Token Provided',
          result: {
            token: token,
          },
        });
      } else {
        responseThrower(res, req.logId, 401, InvalidCredentialsMessage);
      }
    } else {
      responseThrower(res, req.logId, 401, InvalidCredentialsMessage);
    }
  } catch (error) {
    if (error instanceof Ajv.ValidationError) {
      responseThrower(res, req.logId, 400, error);
    } else {
      console.log(error);
      responseThrower(res, req.logId, 500, { error: 'somethingWrongInServer', params: error });
    }
  }
});
//#endregion

//#region Module Exports
module.exports = router;
//#endregion 