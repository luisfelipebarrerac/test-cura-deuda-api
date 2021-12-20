/* eslint-disable no-undef */
const cors = require('cors');
const middleware = require('./libs/middleware');
const morgan = require('morgan'); //logging dev
const express = require('express'); //routing and middleware functions
const config = require('./config');
const app = express();
const appEndpoint = config.express.endpoint;

app.use(cors());
app.use(morgan('combined'));
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({extended: true, limit: '20mb'}));
app.use(middleware.storageInit);

//#region public routes section
app.use(appEndpoint, require('./routes/publics'));
//#endregion

//#region middlewares section
let routes = [];
app.use(middleware.tokenValidator);
app.use(middleware.routesValidator(routes));
//#endregion

//#region private routes section
app.use(appEndpoint + '/settlements', require('./routes/settlements'));
app.use(appEndpoint + '/municipalities', require('./routes/municipalities'));
app.use(appEndpoint + '/states', require('./routes/states'));
//User section

//#endregion

require('./libs/listRoutes')(app._router.stack).map((i) => routes.push(i));

module.exports = app;
