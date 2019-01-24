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

  const unfulfilledPromise = new Promise((resolve, reject) => {
    try {
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
      client.request(query)
        .then((response) => {
          delete getUser._.unfulfilledPromises[key];
          const { user } = response;

          resolve(user);
        })
        .catch((err) => {
          delete getUser._.unfulfilledPromises[key];
          reject(ApiUtils.transformError(err));
        });
    } catch (err) {
      delete getUser._.unfulfilledPromises[key];
      reject(ApiUtils.transformError(err));
    }
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
