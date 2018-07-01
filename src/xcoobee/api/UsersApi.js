import ApiUtils from './ApiUtils';

/**
 * Fetches user information associated with the specified API access token.
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 *
 * @returns {Promise<User>}
 */
export function user(apiAccessToken) {
  // Note: There is no need to make multiple requests for user info with the same API
  // access token if the first request has not been fulfilled yet.  Here we simply
  // return any existing unfulfilled promises instead of making a new request.
  const key = apiAccessToken;
  if (key in user._.unfulfilledPromises) {
    let unfulfilledPromise = user._.unfulfilledPromises[key];
    return unfulfilledPromise;
  }

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
  let unfulfilledPromise = client.request(query)
    .then((response) => {
      const { user } = response;

      return Promise.resolve(user);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });

  user._.unfulfilledPromises[key] = unfulfilledPromise;

  return unfulfilledPromise;
}

user._ = {
  unfulfilledPromises: {},
};

export default {
  user,
};
