import Fs from 'fs';
import Path from 'path';
import readline from 'readline';

import { toBool } from 'qc-to_bool';

import Config from './Config';

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
export function createConfigFromFile(xcoobPath) {
  // Home Environment Variable:
  // On Windows: %USERPROFILE%
  // On Linux: $HOME
  if (xcoobPath === undefined) {
    xcoobPath = process.env.HOME;
    if (!xcoobPath) {
      xcoobPath = process.env.USERPROFILE;
    }
  }
  const cfgFilename = Path.join(xcoobPath, '.xcoobee', 'config');

  return new Promise((resolve, reject) => {
    const configData = {};
    try {
      const configReadStream = Fs.createReadStream(cfgFilename);

      configReadStream.on('error', err => {
        reject(err);
      });

      const lineReader = readline.createInterface({
        input: configReadStream,
      });

      lineReader.on('line', line => {
        const line_tr = line.trim();

        if (line_tr.length > 0) {
          let lineParts = line_tr.split('#'); // Remove comments.
          let nameValueStr = lineParts[0].trim();
          if (nameValueStr.length > 0) {
            let nameValuePair = nameValueStr.split('=');
            let name = nameValuePair[0].trim();
            let value = (nameValuePair[1] || '').trim();
            configData[name] = value;
          }
        }
      });

      // Once the config file is finished being read, then check if it supplied the PGP
      // secret.  If it didn't, then attempt to get it from pgp.secret in the .xcoobee
      // directory.
      lineReader.on('close', function () {
        if ('campaignId' in configData) {
          if (campaignId === '') {
            configData.campaignId = null;
          }
        }
        if ('encrypt' in configData) {
          configData.encrypt = toBool(configData.encrypt, false);
        }
        if ('pgpPassword' in configData) {
          if (pgpPassword === '') {
            configData.pgpPassword = null;
          }
        }
        if ('pgpSecret' in configData) {
          if (pgpSecret === '') {
            configData.pgpSecret = null;
          }
        }

        if (!('pgpSecret' in configData)) {
          const pgpSecretFilename = Path.join(xcoobPath, '.xcoobee', 'pgp.secret');
          // Note: To avoid the race condition between checking for existance of a file and
          // reading it, it is best practice to just attempt to read it and handle the case
          // when it doesn't exist.
          Fs.readFile(pgpSecretFilename, (err, data) => {
            if (err) {
              // If the file doesn't exist, then that is fine.
              if (err.code === 'ENOENT') {
                resolve(new Config(configData));
                return;
              }
              reject(err);
            }
            else {
              configData.pgpSecret = data;
              resolve(new Config(configData));
            }
          });
        }
        else {
          resolve(new Config(configData));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

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

export default ConfigUtils;
