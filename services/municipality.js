//#region File Dependencies 
const db = require('../database/queryFunctions');
//#endregion

//#region Municipality Service
const getByName = async (data) => {
  try {
    const municipalities = await db.municipality.getByName(data);
    const promises = municipalities.map(async (element) => {
      const {d_estado} = await db.state.getById(element.state_id);
      delete element.state_id;
      const municipality = {
        state: d_estado,
        ...element
      };
      return municipality;
    });
    return Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getByCode = async (data) => {
  try {
    const municipalities = await db.municipality.getByCode(data);
    const promises = municipalities.map(async (element) => {
      const {d_estado} = await db.state.getById(element.state_id);
      delete element.state_id;
      const municipality = {
        state: d_estado,
        ...element
      };
      return municipality;
    });
    return Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getByState = async (data) => {
  try {
    const {id} = await db.state.getOneByName(data);
    const municipalities = await db.municipality.getByStateId(id);
    return municipalities;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
//#endregion

//#region Module Exports
module.exports = {
  getByCode,
  getByName,
  getByState,
};
//#endregion