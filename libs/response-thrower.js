//#region Response Thrower Functions
const responseThrower = (res, logId, status, body) => {
  if (!status) status = 200;

  if (status == 400) {
    body = throwAjvError(body);
    status = body.status;
    delete body.status;
  }
  res.status(status).json(body);
};

function throwAjvError(error) {
  let err = {error: 'unknown', status:400};
  if (err.error == 'required') {
    err.dataPath = err.dataPath + '.' + err.params.missingProperty;
    err.params = undefined;
  } else if (err.error == 'additionalProperties') {
    err.dataPath = err.dataPath + '.' + err.params.additionalProperty;
    err.params = undefined;
  } else if (err.error == 'somethingWrongInServer') {
    err.dataPath = undefined;
  } else if (err.error == 'uniqueItems') {
    err.params = undefined;
  } else if (err.error == 'itemDoesNotExist') {
    err.status = 404;
    err.params = undefined;
  } 
  err = {
    error: error.errors[0].keyword,
    dataPath: error.errors[0].dataPath,
    params: error.errors[0].params,
    status: 400
  };
  return err;
}
//#endregion

//#region Module Exports
module.exports = {
  responseThrower,
};
//#endregion
