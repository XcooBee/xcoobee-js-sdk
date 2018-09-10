import UsersApi from './UsersApi';

/**
 * A cache for user information fetched using the `xcoobee/api/UserApi.user`
 * function.
 */
class UsersCache {

  /**
   * Constructs a new user cache with the specified configuration.
   *
   * @param {ApiAccessTokenCache} apiAccessTokenCache The API access token cache to
   *   use so that a new API access token is not needed on each call.
   */
  constructor(apiAccessTokenCache) {
    this._ = {
      apiAccessTokenCache,
      internalCache: {},
    };
  }

  /**
   * Fetches the user information for the specified API key/secret pair.
   *
   * @param {string} apiUrlRoot - The root of the API URL.
   * @param {string} apiKey - Your API key.
   * @param {string} apiSecret - Your API secret.
   * @param {boolean} [fresh=false] - Flag indicating whether to force fetching
   *   fresh user information instead of returning a cached version.
   *
   * @returns {Promise<Object>} An object with information about the user that
   *   corresponds with the specified API key/secret pair.
   *
   * @throws {XcooBeeError}
   */
  get(apiUrlRoot, apiKey, apiSecret, fresh) {
    let key = `${apiKey}:${apiSecret}`;

    if (fresh !== true && key in this._.internalCache) {
      let user = this._.internalCache[key];
      return Promise.resolve(user);
    }

    return this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret)
      .then(apiAccessToken => {
        return UsersApi.getUser(apiUrlRoot, apiAccessToken)
          .then(user => {
            this._.internalCache[key] = user;
            return user;
          })
          .catch(err_unused => {
            // If unable to fetch the user, then it may be due to an old expired API access
            // token.
            // TODO: Only perform the following if we are sure the `err` here is due to an
            // invalid API access token.
            const fresh = true;
            return this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret, fresh)
              .then(apiAccessToken => {
                return UsersApi.getUser(apiUrlRoot, apiAccessToken)
                  .then(user => {
                    this._.internalCache[key] = user;
                    return user;
                  });
              });
          });
      });
  }

}

export default UsersCache;
