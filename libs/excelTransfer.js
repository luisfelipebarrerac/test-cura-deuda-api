/* eslint-disable no-undef */
const path = require('path');
const filePath = path.join(__dirname, '../uploadXls/');
const XLSX = require('xlsx');
const fs = require('fs');
const db = require('../database/queryFunctions');
const { exit } = require('process');
let xlSheetList;
let workbook;

const importXls = async () => {
  console.log('Importando datos a la db...');
  const xlsNames = await getXlsNames(filePath);
  workbook = XLSX.readFile(filePath + xlsNames[0]);
  xlSheetList = workbook.SheetNames;
  for (let i = 1; i < xlSheetList.length; i++) {
    const index = parseInt(i);
    console.log('Insertando: ' + xlSheetList[index]);
    await insertStates(index);
    await insertMunicipality(index);
    await insertCity(index);
    await insertSettlement(index);
  }
  console.log('Datos importados a la db...');
  exit();
};

//#region Insert funtions
const insertStates = async (index) => {
  try {
    const xlData = await getXlData(index);
    const stateInsert = {
      d_estado: xlData[0].d_estado,
      c_estado: xlData[0].c_estado
    };
    await db.state.insert(stateInsert).catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
  }
};

const insertMunicipality = async (index) => {
  try {
    let xlData = await getXlData(index);
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
  } catch (error) {
    console.error(error);
  }
};

const insertCity = async (index) => {
  try {
    let xlData = await getXlData(index);
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
  } catch (error) {
    console.error(error);
  }
};

const insertSettlement = async (index) => {
  try {
    let xlData = await getXlData(index);
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

const getXlData = async (index) => {
  return new Promise((resolve) => {
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[xlSheetList[index]]);
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

