import TokenApi from '../../xcoobee/api/TokenApi';

class ApiAccessTokenCache {

  constructor() {
    this._ = {
      internalCache: {},
    };
  }

  /**
   *
   * @param {string} apiKey
   * @param {string} apiSecret
   */
  get(apiKey, apiSecret, fresh) {
    let key = `${apiKey}:${apiSecret}`;

    if (fresh !== true && key in this._.internalCache) {
      let apiAccessToken = this._.internalCache[key];
      // TODO: Assert that token is not expired or about to expire.
      return Promise.resolve(apiAccessToken);
    }

    return TokenApi.getApiAccessToken({
      apiKey,
      apiSecret,
    })
      .then((apiAccessToken) => {
        this._.internalCache[key] = apiAccessToken;
        return Promise.resolve(apiAccessToken);
      });
  }

}

export default ApiAccessTokenCache;
