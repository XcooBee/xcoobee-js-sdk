import jwtDecode from 'jwt-decode';

import TokenApi from './TokenApi';

const EXPIRATION_TOLERANCE_IN_MS__DEFAULT = 10000;

/**
 * A cache for API access tokens fetched using the
 * `xcoobee/api/TokenApi.getApiAccessToken` function.
 */
class ApiAccessTokenCache {

  /**
   * Constructs a new API access token cache with the specified configuration.
   *
   * @param {Object} [cfg] - An optional configuration.
   * @param {number} [cfg.expTol] - Token expiration tolarance in milliseconds.
   */
  constructor(cfg) {
    this._ = {
      cfg: {
        ...(cfg || {}),
      },
      internalCache: {},
    };
  }

  /**
   * Fetches an API access token for the specified API key/secret pair.
   *
   * Note: If a cached token is expired or about to expire, then a fresh token is
   * automatically fetched.
   *
   * @param {string} apiUrlRoot - The root of the API URL.
   * @param {string} apiKey - Your API key.
   * @param {string} apiSecret - Your API secret.
   * @param {boolean} [fresh=false] - Flag indicating whether to force a fresh API
   *   access token instead of returning a cached version.
   *
   * @returns {Promise<string>} An API access token for the specified API key/secret
   *   pair.
   *
   * @throws {TypeError} If arguments are invalid.
   */
  get(apiUrlRoot, apiKey, apiSecret, fresh) {
    if (!apiUrlRoot) {
      throw TypeError('apiUrlRoot is required.');
    }
    if (!apiKey) {
      throw TypeError('apiKey is required.');
    }
    if (!apiSecret) {
      throw TypeError('apiSecret is required.');
    }
    if (typeof apiUrlRoot !== 'string') {
      throw TypeError('apiUrlRoot must be a string.');
    }
    if (typeof apiKey !== 'string') {
      throw TypeError('apiKey must be a string.');
    }
    if (typeof apiSecret !== 'string') {
      throw TypeError('apiSecret must be a string.');
    }
    const key = `${apiUrlRoot}:${apiKey}:${apiSecret}`;

    if (fresh !== true && key in this._.internalCache) {
      const apiAccessToken = this._.internalCache[key];

      // Assert that token is not expired or is not about to expire.
      const jwtTokenPayload = jwtDecode(apiAccessToken);
      const { exp } = jwtTokenPayload;
      const now = Date.now();
      const expInMs = typeof exp === 'number' && exp === exp ? exp * 1000 : now;
      const msTilExp = expInMs - now;
      const tolerance = this._.cfg.expTol || EXPIRATION_TOLERANCE_IN_MS__DEFAULT;

      if (msTilExp > tolerance) {
        return Promise.resolve(apiAccessToken);
      }
    }

    return TokenApi.getApiAccessToken({
      apiKey,
      apiSecret,
      apiUrlRoot,
    }).then(apiAccessToken => {
      this._.internalCache[key] = apiAccessToken;
      return apiAccessToken;
    });
  }

}

export default ApiAccessTokenCache;
