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



module.exports = {
  publicAuthSchema,
};
