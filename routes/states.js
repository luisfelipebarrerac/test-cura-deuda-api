const express = require('express');
const db = require('../database/queryFunctions');
const Ajv = require('ajv');
const ajv = new Ajv();
const responseThrower = require('../libs/responseThrower.js').responseThrower;
const {getStateSchema} = require('../schemas/routesSchemas');
const router = express.Router();

router.get('/', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getStateSchema, data);
    const result = await db.state.getByName(data.d_estado);
    responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});

module.exports = router;