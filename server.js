//#region File Dependencies 
const fs = require('fs');
const app = require('./app');
const config = require('./config');
//#endregion

//#region Global Variables
let https;
//#endregion

//#region Http Config
if (!config.httpsOptions) {
  https = require('http').createServer(app);
} else {
  const httpsOptions = {
    key: fs.readFileSync(config.httpsOptions.key),
    cert: fs.readFileSync(config.httpsOptions.cert),
  };
  https = require('https').createServer(httpsOptions, app);
}
//#endregion

//#region Http Service
https.listen(config.express.port, config.express.hostname, () => {
  console.log('Server running in port:', config.express.port);
});
//#endregion

