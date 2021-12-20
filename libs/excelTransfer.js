const filePath = '../uploadXls/';
const XLSX = require('xlsx');
const fs = require('fs');
const db = require('../database/queryFunctions');
const { exit } = require('process');

const importXls = async () => {
  await insertStates();
  console.log('Estados insertados en la db...');
  console.log('==============================');
  await insertMunicipality();
  console.log('municipios insertados en la db...');
  console.log('==============================');
  await insertCity();
  console.log('ciudades insertadas en la db...');
  console.log('==============================');
  await insertSettlement();
  console.log('asentamientos insertados en la db...');
  console.log('==============================');
  console.log('Datos importados a la db...');
  exit();
};

//#region Insert funtions
const insertStates = async () => {
  try {
    console.log('insertando STATES en la db...');
    const xlsNames = await getXlsNames(filePath);
    const promises = xlsNames.map(async (xlsName) => {
      const xlData = await getXlData(xlsName);
      const stateInsert = {
        d_estado: xlData[0].d_estado,
        c_estado: xlData[0].c_estado
      };
      return await db.state.insert(stateInsert).catch((err) => console.error(err));
    });
    return Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};

const insertMunicipality = async () => {
  try {
    console.log('insertando MUNICIPALITIES en la db...');
    const xlsNames = await getXlsNames(filePath);
    const globalProm = xlsNames.map(async (xlsName) => {
      let xlData = await getXlData(xlsName);
      const result = await db.state.getByCode(xlData[0].c_estado);
      const state_id = result[0].id;
      const xlFilterData = await removeDuplicates(xlData, 'D_mnpio');
      const promises = xlFilterData.map(async (xlElement) => {
        const municipalityInsert = {
          state_id,
          D_mnpio: xlElement.D_mnpio,
          c_mnpio: xlElement.c_mnpio
        };
        return await db.municipality.insert(municipalityInsert).catch((err) => console.error(err));
      });
      return Promise.all(promises);
    });
    return Promise.all(globalProm);
  } catch (error) {
    console.error(error);
  }
};

const insertCity = async () => {
  try {
    console.log('insertando CITIES en la db...');
    const xlsNames = await getXlsNames(filePath);
    const globalProm = xlsNames.map(async (xlsName) => {
      let xlData = await getXlData(xlsName);
      const xlFilterData = await removeDuplicates(xlData, 'c_cve_ciudad');
      const xlCityData = xlFilterData.filter(element => Object.keys(element).includes('c_cve_ciudad'));
      const promises = xlCityData.map(async (xlElement) => {
        const result = await db.municipality.getByCode(xlElement.c_mnpio);
        const cityInsert = {
          municipality_id: result[0].id,  
          d_ciudad: xlElement.d_ciudad,
          c_cve_ciudad: xlElement.c_cve_ciudad
        };
        return await db.city.insert(cityInsert).catch((err) => console.error(err));
      });
      return Promise.all(promises);
    });
    return Promise.all(globalProm);
  } catch (error) {
    console.error(error);
  }
};

const insertSettlement = async () => {
  try {
    console.log('insertando SETTLEMENTS en la db...');
    const xlsNames = await getXlsNames(filePath);
    const globalProm = xlsNames.map(async (xlsName) => {
      let xlData = await getXlData(xlsName);
      const promises = xlData.map(async (xlElement) => {
        const result = await db.municipality.getByCode(xlElement.c_mnpio);
        const settlementInsert = {
          municipality_id: result[0].id,
          d_codigo : xlElement.d_codigo,
          d_asenta : xlElement.d_asenta,
          d_tipo_asenta : xlElement.d_tipo_asenta,
          d_CP : xlElement.d_CP,
          c_oficina : xlElement.c_oficina,
          c_tipo_asenta : xlElement.c_tipo_asenta,
          id_asenta_cpcons : xlElement.id_asenta_cpcons,
          d_zona : xlElement.d_zona
        };
        return await db.settlement.insert(settlementInsert).catch((err) => console.error(err));
      });
      return Promise.all(promises);
    });
    return Promise.all(globalProm);
  } catch (error) {
    console.error(error);
  }
};
//#endregion

//#region Auxiliar funtions
const getXlsNames = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err)
        reject(err);
      else {
        files.shift();
        resolve (files);
      }
    });
  });
};

const getXlData = async (xlsName) => {
  return new Promise((resolve) => {
    const workbook = XLSX.readFile(filePath + xlsName);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
    resolve(xlData);
  });
};

function removeDuplicates(originalArray, prop) {
  return new Promise((resolve) => {
    let newArray = [];
    let lookupObject  = {};
    for(let i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for(let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    resolve(newArray);
  });

}
//#endregion

importXls();

