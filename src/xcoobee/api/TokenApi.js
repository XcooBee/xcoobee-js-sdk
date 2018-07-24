import fetch from 'node-fetch';

import ApiUtils from './ApiUtils';

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

  let unfulfilledPromise = new Promise((resolve, reject) => {
    const apiAccessTokenUrl = process.env.XCOOBEE__API_ACCESS_TOKEN_URL;

    try {
      fetch(
        apiAccessTokenUrl,
        {
          method: 'POST',
          body: JSON.stringify({
            key: apiKey,
            secret: apiSecret,
          }),
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          timeout: 30000,
        }
      )
        .then((response) => {
          delete getApiAccessToken._.unfulfilledPromises[key];
          response.json()
            .then((body) => {
              let msg = [];
              if (body) {
                if (response.ok) {
                  // The API is returning error messages even when the status is a 200.
                  if (typeof body.errorType === 'string' && body.errorType.length > 0) {
                    if (body.errorMessage) {
                      msg.push(body.errorMessage);
                    }
                    else {
                      msg.push(MSG__GENERIC_ERROR);
                    }
                  }
                  else if (typeof body.token !== 'string' || body.token.trim().length === 0) {
                    msg.push(MSG__GENERIC_ERROR);
                  }
                }
                else if (response.status === 403) {
                  msg.push('Forbidden.');
                  if (body.message) {
                    msg.push(body.message);
                  }
                }
                else {
                  msg.push(MSG__GENERIC_ERROR);
                }
                if (msg.length === 0) {
                  let apiAccessToken = body.token.trim();
                  resolve(apiAccessToken);
                  return;
                }
              }
              else {
                msg.push(MSG__GENERIC_ERROR);
              }
              reject(new XcooBeeError(msg.join(' ')));
            }, (err) => {
              reject(ApiUtils.transformError(err));
            });
        }, (err) => {
          delete getApiAccessToken._.unfulfilledPromises[key];
          reject(ApiUtils.transformError(err));
        });
    }
    catch (err) {
      delete getApiAccessToken._.unfulfilledPromises[key];
      reject(ApiUtils.transformError(err));
    }
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
