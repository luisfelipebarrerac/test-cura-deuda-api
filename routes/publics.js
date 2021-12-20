const express = require('express');
const db = require('../database/queryFunctions');
const Ajv = require('ajv');
const ajv = new Ajv();
const config = require('../config');
var jwt = require('jsonwebtoken'); 
const responseThrower = require('../libs/responseThrower.js').responseThrower;
const {publicAuthSchema} = require('../schemas/routesSchemas');
const router = express.Router();

router.post('/authenticate', async (req, res) => {
  const data = req.body;
  try {
    await ajv.validate(publicAuthSchema, data);
    const { username } = data;
    const user = await db.user.getByUsername(username);
    if(user){
      const isValidated = await db.user.validateUser(user.id, data.password);
      if(isValidated){
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            permissions: user.permissions,
            client_id: user.client_id,
          },
          config.secretKey,
          {
            expiresIn: 28800, // expira en 8 horas
          }
        );
        responseThrower(res, req.logId, 200, {
          message: 'Token Provided',
          result: {
            token: token,
          },
        });
      } else {
        responseThrower(res, req.logId, 401, {error: 'InvalidCredentials' });
      }
    } else {
      responseThrower(res, req.logId, 401, {error: 'InvalidCredentials' });
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


module.exports = router;
