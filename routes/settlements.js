const express = require('express');
const db = require('../database/queryFunctions');
const Ajv = require('ajv');
const ajv = new Ajv();
const responseThrower = require('../libs/responseThrower.js').responseThrower;
const {getSettlementSchema} = require('../schemas/routesSchemas');
const router = express.Router();

router.get('/', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getSettlementSchema, data);
    if(data.d_codigo){
      const result = await db.settlement.getByCp(data.d_codigo);
      responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
    } else if(data.d_asenta){
      const result = await db.settlement.getByName(data.d_asenta);
      responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
    } else {
      responseThrower(res, req.logId, 400, {errors: [{dataPath: '', keyword: 'No search param', params: ['d_codigo', 'd_asenta'] }]});
    }
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});






module.exports = router;
