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

  // hasApiAccessToken(apiKey, apiSecret) {
  //   let key = `${apiKey}:${apiSecret}`;

  //   let hasApiAccessToken = key in this._;
  //   return hasApiAccessToken;
  // }

  // set(apiKey, apiSecret, apiAccessToken) {
  //   // TODO: Validate arguments.
  //   let key = `${apiKey}:${apiSecret}`;
  //   this._[key] = apiAccessToken;
  // }

  /**
   * Invalidates entire cache.
   */
  /**
   * Invalidates the cache for the specified API key/secret pair.
   *
   * @param {string} apiKey
   * @param {string} apiSecret
   */
  // invalidate(apiKey, apiSecret) {
  //   if (arguments.length === 0) {
  //     this._ = {};
  //   }
  //   else if (arguments.length === 2) {
  //     let key = `${apiKey}:${apiSecret}`;
  //     delete this._[key];
  //   }
  //   else {
  //     throw TypeError('Invalid arguments.');
  //   }
  // }

}

export default ApiAccessTokenCache;
