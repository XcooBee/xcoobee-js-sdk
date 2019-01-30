const ApiUtils = require('./ApiUtils');

/**
 * Fetches user information associated with the specified API access token.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 *
 * @returns {Promise<User>} - The user information.
 *
 * @throws {XcooBeeError}
 */
const getUser = (apiUrlRoot, apiAccessToken) => {
  // Note: There is no need to make multiple requests for user info with the same API
  // access token if the first request has not been fulfilled yet.  Here we simply
  // return any existing unfulfilled promises instead of making a new request.
  const key = apiAccessToken;
  if (key in getUser._.unfulfilledPromises) {
    return getUser._.unfulfilledPromises[key];
  }

  const client = ApiUtils.createClient(apiUrlRoot, apiAccessToken);
  const query = `
    query {
      user {
        cursor
        xcoobee_id
        pgp_public_key
      }
    }
  `;

  const unfulfilledPromise = client.request(query)
    .then((response) => {
      delete getUser._.unfulfilledPromises[key];

      return response.user;
    })
    .catch((err) => {
      delete getUser._.unfulfilledPromises[key];
      throw ApiUtils.transformError(err);
    });

  getUser._.unfulfilledPromises[key] = unfulfilledPromise;

  return unfulfilledPromise;
};

getUser._ = {
  unfulfilledPromises: {},
};

module.exports = {
  getUser,
};
