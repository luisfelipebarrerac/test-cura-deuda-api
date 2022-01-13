//#region File Dependencies 
const express = require('express');
const Ajv = require('ajv');
const ajv = new Ajv();
const responseThrower = require('../libs/response-thrower.js').responseThrower;
const {getSettlementSchema} = require('../schemas/routes-schemas');
const settlementService = require('../services/settlement');
const router = express.Router();
//#endregion

//#region Settlements Controller
router.get('/', async (req, res) =>{
  try {
    const data = req.body;
    await ajv.validate(getSettlementSchema, data);
    if(data.d_codigo){
      const result = await settlementService.getByCp(data.d_codigo);
      responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
    } else if(data.d_asenta){
      const result = await settlementService.getByName(data.d_asenta);
      responseThrower(res, req.logId, 200, { result, itemsFound: result.length });
    } else {
      responseThrower(res, req.logId, 400, {errors: [{dataPath: '', keyword: 'No search param', params: ['d_codigo', 'd_asenta'] }]});
    }
  } catch (error) {
    responseThrower(res, req.logId, 400, error);
  }
});
//#endregion

//#region Module Exports
module.exports = router;
//#endregion