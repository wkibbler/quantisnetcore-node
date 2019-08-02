'use strict';

var path = require('path');

/**
 * Will return the path and default quantisnetcore-node configuration on environment variables
 * or default locations.
 * @param {Object} options
 * @param {String} options.network - "testnet" or "livenet"
 * @param {String} options.datadir - Absolute path to Quantsisnet database directory
 */
function getDefaultBaseConfig(options) {
  if (!options) {
    options = {};
  }

  var datadir = options.datadir || path.resolve(process.env.HOME, '.quantisnet');

  return {
    path: process.cwd(),
    config: {
      network: options.network || 'livenet',
      port: 3001,
      services: ['quantisnetd', 'web'],
      servicesConfig: {
        quantisnetd: {
          spawn: {
            datadir: datadir,
            exec: path.resolve(__dirname, datadir, 'quantisnetd')
          }
        }
      }
    }
  };
}

module.exports = getDefaultBaseConfig;
