//#region File Dependencies 
const db = require('../database/queryFunctions');
//#endregion

//#region Municipality Service
const getByName = async (data) => {
  try {
    const states = await db.state.getByName(data);
    return states;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
//#endregion

//#region Module Exports
module.exports = {
  getByName,
};
//#endregion