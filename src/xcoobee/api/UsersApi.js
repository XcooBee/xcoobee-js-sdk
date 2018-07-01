import ApiUtils from './ApiUtils';

/**
 * Fetches user information associated with the specified API access token.
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 *
 * @returns {Promise<User>}
 */
export function user(apiAccessToken) {
  const query = `
    query {
      user {
        cursor
        xcoobee_id
        pgp_public_key
      }
    }
  `;
  return ApiUtils.createClient(apiAccessToken).request(query)
    .then((response) => {
      const { user } = response;

      return Promise.resolve(user);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  user,
};
