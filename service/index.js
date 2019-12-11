const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const service = {};

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    /* eslint-disable import/no-dynamic-require,global-require */
    service[file.split('.')[0]] = require(path.join(__dirname, file));
  });

module.exports = service;
