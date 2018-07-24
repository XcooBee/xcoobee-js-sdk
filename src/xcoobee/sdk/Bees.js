import BeesApi from '../../xcoobee/api/BeesApi';

import ErrorResponse from './ErrorResponse';
import SdkUtils from './SdkUtils';
import SuccessResponse from './SuccessResponse';

/**
 * The Bees service.
 */
class Bees {

  constructor(config, apiAccessTokenCache, usersCache) {
    this._ = {
      apiAccessTokenCache,
      config: config || null,
      usersCache,
    };
  }

  set config(config) {
    this._.config = config;
  }

  _assertValidState() {
    if (!this._.config) {
      throw TypeError('Illegal State: Default config has not been set yet.');
    }
  }

  /**
   * Returns a list of bees in the system that your account is able to hire that
   * match the specified search text.
   *
   * ```js
   * listBees('social')
   *   .then((res) => {
   *     const { code, data, errors, time } = res;
   *     if (code >= 300 || errors) {
   *       if (errors) {
   *         console.error(errors);
   *       }
   *       return;
   *     }
   *     const bees = data;
   *     bees.forEach((bee) => {
   *       const { bee_system_name, description, bee_icon, ...etc } = bee;
   *       // DO something with this data.
   *     });
   *   })
   * ```
   *
   * @param {string} searchText - The search text.  It is a string of keywords to
   *  search for in the bee system name or label in the language of your account.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  async listBees(searchText, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiKey, apiSecret);
      const beesList = await BeesApi.bees(apiAccessToken, searchText);
      const response = new SuccessResponse(beesList);
      return Promise.resolve(response);
    } catch (err) {
      // TODO: Get status code from err.
      const code = 400;
      // TODO: Translate errors to correct shape.
      const errors = [err];
      return Promise.resolve(new ErrorResponse(code, errors));
    }
  }

  /**
   *
   * @param {string[]} bees - A mapping of bee names to bee parameters.
   * @param {string} bees<key> - The bee name.
   * @param {Object} bees<value> - The bee parameters.
   * @param {Object} options - The bee take off options.
   * @param {Object} options.process -
   * @param {Array<email|XcooBeeId>} [options.process.destinations] -
   * @param {?} options.process.fileNames -
   * @param {Object} [options.process.userReference] -
   * @param {?} [subscriptions]
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  takeOff(bees, options, subscriptions, config) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Uploads specified files to XcooBee.
   *
   * @param {string[]} files - File paths of the files on the local file system
   *   to be uploaded.  For example, 'C:\Temp\MyPic.jpg' or '~/MyPic.jpg`.
   *   TODO: Test what file paths actually work and make sure the documentation is
   *   adequate.  Be sure to show examples of various path types.
   * @param {string} [endpoint] - One of the "outbox" endpoints defined in the
   *   XcooBee UI.  If an endpoint is not specified, then be sure to call the
   *   `takeOff` function afterwards.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  uploadFiles(files, endpoint, config) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class Bees

export default Bees;
