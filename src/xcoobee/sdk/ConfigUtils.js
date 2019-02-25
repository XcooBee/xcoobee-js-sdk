const Fs = require('fs');
const Path = require('path');
const readline = require('readline');

const { toBool } = require('qc-to_bool');

const Config = require('./Config');

const API_URL = 'https://api.xcoobee.net';
const TEST_API_URL = 'https://testapi.xcoobee.net/Test';

/**
 * Creates a {@link Config Config} instance from the given XcooBee path.
 *
 * @param {string} [xcoobPath] - The path to the `.xcoobee` directory containing
 *   the configuration file.  If `undefined`, then tries the user's `HOME` directory.
 *   On Linux, the `HOME` directory is determined by the `HOME` environment variable.
 *   On Windows, the `HOME` directory is determined by the `USERPROFILE` environment
 *   variable.
 *
 * @returns {Promise<Config, Error>}
 *
 * @throws {core.XcooBeeError}
 */
const createConfigFromFile = (xcoobPath) => {
  // Home Environment Variable:
  // On Windows: %USERPROFILE%
  // On Linux: $HOME
  let homePath = xcoobPath;
  if (homePath === undefined) {
    homePath = process.env.HOME;
    if (!homePath) {
      homePath = process.env.USERPROFILE;
    }
  }
  const cfgFilename = Path.join(homePath, '.xcoobee', 'config');

  return new Promise((resolve, reject) => {
    const apiUrlRoot = process.env.XBEE_STATE === 'test' ? TEST_API_URL : API_URL;

    const configData = { apiUrlRoot };
    try {
      const configReadStream = Fs.createReadStream(cfgFilename);

      configReadStream.on('error', (err) => {
        reject(err);
      });

      const lineReader = readline.createInterface({
        input: configReadStream,
      });

      lineReader.on('line', (line) => {
        const line_tr = line.trim();

        if (line_tr.length > 0) {
          const lineParts = line_tr.split('#'); // Remove comments.
          const nameValueStr = lineParts[0].trim();
          if (nameValueStr.length > 0) {
            const nameValuePair = nameValueStr.split('=');
            const name = nameValuePair[0].trim();
            const value = (nameValuePair[1] || '').trim();
            configData[name] = value;
          }
        }
      });

      // Once the config file is finished being read, then check if it supplied the PGP
      // secret.  If it didn't, then attempt to get it from pgp.secret in the .xcoobee
      // directory.
      lineReader.on('close', () => {
        if ('campaignId' in configData) {
          if (configData.campaignId === '') {
            configData.campaignId = null;
          }
        }
        if ('encrypt' in configData) {
          configData.encrypt = toBool(configData.encrypt, false);
        }
        if ('pgpPassword' in configData) {
          if (configData.pgpPassword === '') {
            configData.pgpPassword = null;
          }
        }
        if ('pgpSecret' in configData) {
          if (configData.pgpSecret === '') {
            configData.pgpSecret = null;
          }
        }

        if (!('pgpSecret' in configData)) {
          const pgpSecretFilename = Path.join(xcoobPath, '.xcoobee', 'pgp.secret');
          // Note: To avoid the race condition between checking for existance of a file and
          // reading it, it is best practice to just attempt to read it and handle the case
          // when it doesn't exist.
          Fs.readFile(pgpSecretFilename, 'utf8', (err, data) => {
            if (err) {
              // If the file doesn't exist, then that is fine.
              if (err.code === 'ENOENT') {
                resolve(new Config(configData));
                return;
              }
              reject(err);
            } else {
              configData.pgpSecret = data;
              resolve(new Config(configData));
            }
          });
        } else {
          resolve(new Config(configData));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @namespace ConfigUtils
 */
const ConfigUtils = {
  /**
   * An alias of {@link createConfigFromFile}.
   * @memberof ConfigUtils
   */
  createFromFile: createConfigFromFile,
};

module.exports = ConfigUtils;
