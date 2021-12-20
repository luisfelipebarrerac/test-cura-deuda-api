const express = require('express');
const db = require('../database/queryFunctions');
const Ajv = require('ajv');
const ajv = new Ajv();
const responseThrower = require('../libs/responseThrower.js').responseThrower;
const {getMunicipalitySchema} = require('../schemas/routesSchemas');
const router = express.Router();

router.get('/', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getMunicipalitySchema, data);
    const result = await db.municipality.getByName(data.D_mnpio);
    responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});

module.exports = router;
