//#region AJV Schemas 

//#region Auth Schemas
const publicAuthSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    user: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['user', 'password'],
};
//#endregion Auth Schemas

//#region Settlement Schemas
const getSettlementSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    d_codigo: { type: 'string' },
    d_asenta: { type: 'string' },
  },
  required: ['d_codigo', 'd_asenta']
};
//#endregion Settlement Schemas

//#region Municipality Schemas
const getMunicipalitySchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    D_mnpio: { type: 'string' }
  },
  required: ['D_mnpio'],
};

const getMunicipalityByCodeSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    c_mnpio: { type: 'string' }
  },
  required: ['c_mnpio'],
};

const getMunicipalityByStateSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    state: { type: 'string' }
  },
  required: ['state'],
};
//#endregion Municipality Schemas

//#region State Schemas
const getStateSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    d_estado: { type: 'string' }
  },
  required: ['d_estado'],
};
//#endregion State Schemas

//#endregion AJV Schemas

//#region Module Exports
module.exports = {
  publicAuthSchema,
  getSettlementSchema,
  getMunicipalitySchema,
  getStateSchema,
  getMunicipalityByCodeSchema,
  getMunicipalityByStateSchema
};
//#endregion