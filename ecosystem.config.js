//#endregion Global Variables
const name = 'sepomex-api';
//#endregion

//#region Module Exports
module.exports = {
  apps: [
    {
      name: name,
      script: './server.js',
      // output: "./" + name + "-out.log",
      // error: "./" + name + "-err.log",
      watch: false,
      ignore_watch: [
        'node_modules',
      ],
      // env: {
      //   NODE_ENV: "development"
      // },
      // interpreter: "/usr/bin/node"
    },
  ],
};
//#endregion

