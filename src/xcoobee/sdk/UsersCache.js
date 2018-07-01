import UsersApi from '../../xcoobee/api/UsersApi';

class UsersCache {

  constructor(apiAccessTokenCache) {
    this._ = {
      apiAccessTokenCache,
      internalCache: {},
    };
  }

  /**
   *
   * @param {string} apiKey
   * @param {string} apiSecret
   * @param {boolean} [fresh=false]
   */
  get(apiKey, apiSecret, fresh) {
    let key = `${apiKey}:${apiSecret}`;

    if (fresh !== true && key in this._.internalCache) {
      let user = this._.internalCache[key];
      return Promise.resolve(user);
    }

    return this._.apiAccessTokenCache.get(apiKey, apiSecret)
      .then((apiAccessToken) => {
        return UsersApi.user(apiAccessToken)
          .then((user) => {
            this._.internalCache[key] = user;
            return Promise.resolve(user);
          }, (err) => {
            // If unable to fetch the user, then it may be due to an old expired API access
            // token.
            // TODO: Only preform the following if we are sure the err here is due to an
            // invalid API access token.
            const fresh = true;
            return this._.apiAccessTokenCache.get(apiKey, apiSecret, fresh)
              .then((apiAccessToken) => {
                return UsersApi.user(apiAccessToken)
                  .then((user) => {
                    this._.internalCache[key] = user;
                    return Promise.resolve(user);
                  });
              });
          });
      });
  }

}

export default UsersCache;
