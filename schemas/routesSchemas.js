const publicAuthSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'password'],
};

const getSettlementSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    d_codigo: { type: 'string' },
    d_asenta: { type: 'string' },
  }
};

const getMunicipalitySchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    D_mnpio: { type: 'string' }
  },
  required: ['D_mnpio'],
};

const getStateSchema = {
  $async: true,
  additionalProperties: false,
  type: 'object',
  properties: {
    d_estado: { type: 'string' }
  },
  required: ['d_estado'],
};



module.exports = {
  publicAuthSchema,
  getSettlementSchema,
  getMunicipalitySchema,
  getStateSchema
};
