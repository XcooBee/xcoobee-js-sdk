import ApiUtils from './ApiUtils';

/**
 * Fetches user information associated with the specified API access token.
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 *
 * @returns {Promise<User>}
 */
export function getUser(apiAccessToken) {
  // Note: There is no need to make multiple requests for user info with the same API
  // access token if the first request has not been fulfilled yet.  Here we simply
  // return any existing unfulfilled promises instead of making a new request.
  const key = apiAccessToken;
  if (key in getUser._.unfulfilledPromises) {
    let unfulfilledPromise = getUser._.unfulfilledPromises[key];
    return unfulfilledPromise;
  }

  let unfulfilledPromise = new Promise((resolve, reject) => {
    try {
      const client = ApiUtils.createClient(apiAccessToken);
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
        }, (err) => {
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
}

getUser._ = {
  unfulfilledPromises: {},
};

export default {
  getUser,
};
