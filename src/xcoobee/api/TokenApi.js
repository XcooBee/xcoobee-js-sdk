const fetch = require('cross-fetch');
const XcooBeeError = require('../core/XcooBeeError');
const ApiUtils = require('./ApiUtils');

const MSG__GENERIC_ERROR = 'Unable to get an API access token.';

/**
 * Fetches a new API access token.  The access token can be used in other API
 * requests.
 *
 * @param {Object|Config} apiCfg - API configuration.  This may be a `Config`
 *   instance since it has the same shape.
 * @param {string} apiCfg.apiKey - Your API key.
 * @param {string} apiCfg.apiSecret - Your API secret.
 * @param {string} apiCfg.apiUrlRoot - The root of the API URL.
 *
 * @returns {Promise<ApiAccessToken>} An access token.
 *
 * @throws {XcooBeeError} if unable to acquire an access token.
 */
const getApiAccessToken = (apiCfg) => {
  // Note: There is no need to make multiple requests for an API access token with
  // the same API key/secret if the first request has not been fulfilled yet.  Here
  // we simply return any existing unfulfilled promises instead of making a new
  // request.

  const { apiKey, apiSecret, apiUrlRoot } = apiCfg;
  const key = `${apiKey}:${apiSecret}`;
  if (key in getApiAccessToken._.unfulfilledPromises) {
    return getApiAccessToken._.unfulfilledPromises[key];
  }

  const apiAccessTokenUrl = `${apiUrlRoot}/get_token`;

  const unfulfilledPromise = fetch(
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

      return response.json()
        .then((body) => {
          const msg = [];
          if (body) {
            if (response.ok) {
              // The API is returning error messages even when the status is a 200.
              if (typeof body.errorType === 'string' && body.errorType.length > 0) {
                if (body.errorMessage) {
                  msg.push(body.errorMessage);
                } else {
                  msg.push(MSG__GENERIC_ERROR);
                }
              } else if (typeof body.token !== 'string' || body.token.trim().length === 0) {
                msg.push(MSG__GENERIC_ERROR);
              }
            } else if (response.status === 403) {
              msg.push('Forbidden.');

              if (body.message) {
                msg.push(body.message);
              }
            } else {
              msg.push(MSG__GENERIC_ERROR);
            }

            if (msg.length === 0) {
              return body.token.trim();
            }
          } else {
            msg.push(MSG__GENERIC_ERROR);
          }

          throw new XcooBeeError(msg.join(' '));
        });
    })
    .catch((err) => {
      delete getApiAccessToken._.unfulfilledPromises[key];
      throw ApiUtils.transformError(err);
    });

  getApiAccessToken._.unfulfilledPromises[key] = unfulfilledPromise;

  return unfulfilledPromise;
};

getApiAccessToken._ = {
  unfulfilledPromises: {},
};

module.exports = {
  getApiAccessToken,
};
