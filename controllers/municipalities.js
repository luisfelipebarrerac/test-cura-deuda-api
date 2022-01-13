//#region File Dependencies 
const express = require('express');
const Ajv = require('ajv');
const ajv = new Ajv();
const responseThrower = require('../libs/response-thrower.js').responseThrower;
const {getMunicipalityByStateSchema, getMunicipalitySchema, getMunicipalityByCodeSchema} = require('../schemas/routes-schemas');
const router = express.Router();
const municipalityService = require('../services/municipality');
//#endregion

//#region Municipalities Controller
router.get('/name', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getMunicipalitySchema, data);
    const result = await municipalityService.getByName(data.D_mnpio);
    responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});

router.get('/code', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getMunicipalityByCodeSchema, data);
    const result = await municipalityService.getByCode(data.c_mnpio);
    responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});

router.get('/state', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getMunicipalityByStateSchema, data);
    const result = await municipalityService.getByState(data.state);
    responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});
//#endregion

//#region Module Exports
module.exports = router;
//#endregion