function responseThrower(res, logId, status, body) {
  if (!status) status = 200;

  if (status == 400) {
    body = throwAjvError(body);
    status = body.status;
    delete body.status;
  }
  res.status(status).json(body);
}

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
  } else if (error === 'errorInRobot') {
    err = {
      error,
      status: 500
    };
    return err;
  }
  if(error.errors.length > 1){
    if(error.errors[error.errors.length - 1].keyword == 'anyOf'){
      err = {
        error: 'anyOf',
        params: {
          properties: []
        },
        status: 400
      };
      for(let i=0; i < error.errors.length - 1; i++){
        err.params.properties.push(error.errors[i].params.missingProperty);
      }
    }
    else if(error.errors[error.errors.length - 1].keyword == 'oneOf'){
      err = {
        error: 'oneOf',
        params: {
          properties: []
        },
        status: 400
      };
      for(let i=0; i < error.errors.length - 1; i++){
        err.params.properties.push(error.errors[i].params.missingProperty);
      }
    }
  } else {
    err = {
      error: error.errors[0].keyword,
      dataPath: error.errors[0].dataPath,
      params: error.errors[0].params,
      status: 400
    };
  }
  return err;
}

module.exports.responseThrower = responseThrower;
