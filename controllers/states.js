//#region File Dependencies 
const express = require('express');
const Ajv = require('ajv');
const ajv = new Ajv();
const responseThrower = require('../libs/response-thrower.js').responseThrower;
const {getStateSchema} = require('../schemas/routes-schemas');
const stateService = require('../services/state');
const router = express.Router();
//#endregion

//#region States Controller
router.get('/name', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getStateSchema, data);
    const result = await stateService.getByName(data.d_estado);
    responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});
//#endregion

//#region Module Exports
module.exports = router;
//#endregion