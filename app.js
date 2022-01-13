//#region File Dependencies 
/* eslint-disable no-undef */
const cors = require('cors');
const middleware = require('./libs/middleware');
const morgan = require('morgan'); //logging dev
const express = require('express'); //routing and middleware functions
const config = require('./config');
//#endregion

//#region Global Variables
const app = express();
const appEndpoint = config.express.endpoint;
//#endregion

//#region App Config
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({extended: true, limit: '20mb'}));
app.use(middleware.storageInit);
//#endregion

//#region Public Routes Section
app.use(appEndpoint, require('./controllers/publics'));
//#endregion

//#region Middleware Section
let routes = [];
app.use(middleware.tokenValidator);
app.use(middleware.routesValidator(routes));
//#endregion

//#region Private Routes Section
app.use(appEndpoint + '/settlements', require('./controllers/settlements'));
app.use(appEndpoint + '/municipalities', require('./controllers/municipalities'));
app.use(appEndpoint + '/states', require('./controllers/states'));
//#endregion

require('./libs/list-routes')(app._router.stack).map((i) => routes.push(i));

//#region Module Exports
module.exports = app;
//#endregion
