import axios from 'axios';

import XcooBeeError from '../core/XcooBeeError';

const MSG__GENERIC_ERROR = 'Unable to get an API access token.';

/**
 * Fetches a new API access token.  The access token can be used in other API
 * requests.
 *
 * @param {Object|Config} apiCfg - API configuration.  This may be a `Config`
 *   instance since it has the same shape.
 * @param {string} apiCfg.apiKey - Your API key.
 * @param {string} apiCfg.apiSecret - Your API secret.
 *
 * @returns {Promise<ApiAccessToken>} An access token.
 *
 * @throws Error if unable to acquire an access token.
 */
export function getApiAccessToken(apiCfg) {
  // Note: There is no need to make multiple requests for an API access token with
  // the same API key/secret if the first request has not been fulfilled yet.  Here
  // we simply return any existing unfulfilled promises instead of making a new
  // request.
  let { apiKey, apiSecret } = apiCfg;
  let key = `${apiKey}:${apiSecret}`;
  if (key in getApiAccessToken._.unfulfilledPromises) {
    let unfulfilledPromise = getApiAccessToken._.unfulfilledPromises[key];
    return unfulfilledPromise;
  }

  const apiAccessTokenUrl = process.env.XCOOBEE__API_ACCESS_TOKEN_URL;
  const reqData = {
    key: apiKey,
    secret: apiSecret,
  };
  const cfg = {
    timeout: 30000,
  };
  let unfulfilledPromise = axios.post(apiAccessTokenUrl, reqData, cfg);
  unfulfilledPromise = unfulfilledPromise
    .then((response) => {
      delete getApiAccessToken._.unfulfilledPromises[key];
      let msg = [];
      if (response.status >= 200 && response.status < 300) {
        // The API is returning error messages even when the status is a 200.
        if (typeof response.data.errorType === 'string' && response.data.errorType.length > 0) {
          if (response.data.errorMessage) {
            msg.push(response.data.errorMessage);
          }
          else {
            msg.push(MSG__GENERIC_ERROR);
          }
        }
        else if (typeof response.data.token !== 'string' || response.data.token.trim().length === 0) {
          msg.push(MSG__GENERIC_ERROR);
        }
      }
      else {
        msg.push(MSG__GENERIC_ERROR);
      }
      if (msg.length === 0) {
        return response.data.token.trim();
      }
      throw new XcooBeeError(msg.join(' '));
    }, (err) => {
      delete getApiAccessToken._.unfulfilledPromises[key];
      // console.log('An error occurred:');
      // console.error(err);
      let msg = [];

      if (err.response) {
        if (err.response.status === 403) {
          msg.push('Forbidden.');
        }
        if (err.response.data.message) {
          msg.push(err.response.data.message);
        }
      }
      if (msg.length === 0) {
        msg.push(MSG__GENERIC_ERROR);
      }

      throw new XcooBeeError(msg.join(' '));
    });

  getApiAccessToken._.unfulfilledPromises[key] = unfulfilledPromise;

  return unfulfilledPromise;
}

getApiAccessToken._ = {
  unfulfilledPromises: {},
};

export default {
  getApiAccessToken,
};
