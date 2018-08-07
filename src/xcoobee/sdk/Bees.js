import ApiUtils from '../../xcoobee/api/ApiUtils';
import BeesApi from '../../xcoobee/api/BeesApi';
import DirectiveApi from '../../xcoobee/api/DirectiveApi';
import EndPointApi from '../../xcoobee/api/EndPointApi';
import FileApi from '../../xcoobee/api/FileApi';
import PolicyApi from '../../xcoobee/api/PolicyApi';
import UploadPolicyIntents from '../../xcoobee/api/UploadPolicyIntents';

import ErrorResponse from './ErrorResponse';
import SdkUtils from './SdkUtils';
import SuccessResponse from './SuccessResponse';
import XcooBeeError from '../core/XcooBeeError';

function _zip(files, policies) {
  const pairs = [];
  // Note: Not expecting the lengths between the two arrays to be different, but
  // it doesn't hurt to be robust.
  const maxLen = Math.max(files.length, policies.length);
  for (let i = 0; i < maxLen; ++i) {
    const file = files[i] || null;
    const policy = policies[i] || null;
    pairs.push({ file, policy });
  }
  return pairs;
}

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
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const beesList = await BeesApi.bees(apiUrlRoot, apiAccessToken, searchText);
      const response = new SuccessResponse(beesList);
      return Promise.resolve(response);
    } catch (err) {
      const code = 400;
      const errors = [err];
      return Promise.resolve(new ErrorResponse(code, errors));
    }
  }

  /**
   *
   * @param {string[]} bees - A mapping of bee names to bee parameters.
   * @param {string} bees<key> - The bee name.  A 'transfer' bee will be ignored.
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
  async takeOff(bees, options, subscriptions, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    const directiveInput = {
      filenames: options.process.fileNames,
      user_reference: options.process.userReference || null,
    };

    if (subscriptions) {
      directiveInput.subscriptions = subscriptions;
    }

    if (Array.isArray(options.process.destinations) && options.process.destinations.length > 0) {
      directiveInput.destinations = options.process.destinations.map(destination => {
        if (ApiUtils.appearsToBeAnEmailAddress(destination)) {
          return { email: destination };
        }
        return { xcoobee_id: destination };
      });
    }

    directiveInput.bees = [];
    for (let beeName in bees) {
      if (beeName !== 'transfer') {
        let beeParams = bees[beeName];
        directiveInput.bees.push({ bee_name: beeName, params: JSON.stringify(beeParams) });
      }
    }

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const directiveResult = await DirectiveApi.addDirective(apiUrlRoot, apiAccessToken, directiveInput);
      const response = new SuccessResponse(directiveResult.ref_id);
      return Promise.resolve(response);
    } catch (err) {
      const code = 400;
      const errors = [err];
      return Promise.resolve(new ErrorResponse(code, errors));
    }
  }

  /**
   * Uploads specified files to XcooBee.
   *
   * @param {string[]|File[]} files - File paths of the files on the local file system
   *   to be uploaded.  For example, 'C:\Temp\MyPic.jpg' or '~/MyPic.jpg`.  Or an array
   *   of 'File' objects as is available in a modern browser.
   *   TODO: Test what file paths actually work and make sure the documentation is
   *   adequate.  Be sure to show examples of various path types.
   * @param {string} [intent] - One of the "outbox" endpoints defined in the
   *   XcooBee UI.  If an endpoint is not specified, then be sure to call the
   *   `takeOff` function afterwards.  TODO: Make sure this documentation is accurate.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  async uploadFiles(files, intent, config) {
    this._assertValidState();
    let apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret);
      const userCursor = user.cursor;
      const endPoints = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
      const endPointName = intent || UploadPolicyIntents.OUTBOX;

      if (endPointName !== UploadPolicyIntents.OUTBOX) {
        throw new XcooBeeError(`The "intent" argument must be one of: null, undefined, or "${UploadPolicyIntents.OUTBOX}".`);
      }

      // Find the endpoint with the name matching the specified intent.
      let candidateEndPoints = endPoints.filter(endPoint => endPoint.name === endPointName);
      // If not found, then fallback to the flex end point.
      if (candidateEndPoints.length === 0) {
        candidateEndPoints = endPoints.filter(endPoint => endPoint.name === 'flex');
      }

      if (candidateEndPoints.length !== 1) {
        throw new XcooBeeError(`Unable to find an endpoint named ${endPointName} or the fallback end point.`);
      }

      const endPoint = candidateEndPoints[0];
      const endPointCursor = endPoint.cursor;

      const uploadPolicyIntent = endPointName;

      const policies = await PolicyApi.upload_policy(apiUrlRoot, apiAccessToken, uploadPolicyIntent, endPointCursor, files);
      const policyFilePairs = _zip(files, policies);
      // Note: We don't want to upload one file, wait for the promise to resolve,
      // and then repeat.  Here we are uploading all files back-to-back. ...
      const fileUploadPromises = policyFilePairs.map(pair => {
        const { file, policy } = pair;

        return FileApi.upload_file(file, policy);
      });

      // ... Then here we resolve each promise.
      const fileUploadResults = await Promise.all(fileUploadPromises);
      const results = policyFilePairs.map((pair, idx) => {
        const { file } = pair;
        const fileUploadResult = fileUploadResults[idx];
        return { file, success: !!fileUploadResult };
      });
      const response = new SuccessResponse(results);
      return Promise.resolve(response);
    } catch (err) {
      const code = 400;
      const errors = [err];
      return Promise.resolve(new ErrorResponse(code, errors));
    }
  }

}// eo class Bees

export default Bees;
