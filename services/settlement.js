//#region File Dependencies 
const db = require('../database/queryFunctions');
//#endregion

//#region Settlement Service
const getByCp = async (data) => {
  try {
    const settlement = await db.settlement.getByCp(data);
    const promises = settlement.map(async (element) => {
      const {D_mnpio, state_id} = await db.municipality.getById(element.municipality_id);
      delete element.municipality_id;
      const {d_estado} = await db.state.getById(state_id);
      const settlement = {
        state: d_estado,
        municipality: D_mnpio,
        ...element
      };
      return settlement;
    });
    return Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getByName = async (data) => {
  try {
    const settlement = await db.settlement.getByName(data);
    const promises = settlement.map(async (element) => {
      const {D_mnpio, state_id} = await db.municipality.getById(element.municipality_id);
      delete element.municipality_id;
      const {d_estado} = await db.state.getById(state_id);
      const settlement = {
        state: d_estado,
        municipality: D_mnpio,
        ...element
      };
      return settlement;
    });
    return Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
//#endregion

//#region Module Exports
module.exports = {
  getByCp,
  getByName,
};
//#endregion