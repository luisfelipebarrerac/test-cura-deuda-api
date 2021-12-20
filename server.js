const fs = require('fs');
const app = require('./app');
const config = require('./config');

let https;
if (!config.httpsOptions) {
  https = require('http').createServer(app);
} else {
  const httpsOptions = {
    key: fs.readFileSync(config.httpsOptions.key),
    cert: fs.readFileSync(config.httpsOptions.cert),
  };
  https = require('https').createServer(httpsOptions, app);
}
https.listen(config.express.port, config.express.hostname, () => {
  console.log('Server running in port:', config.express.port);
});

