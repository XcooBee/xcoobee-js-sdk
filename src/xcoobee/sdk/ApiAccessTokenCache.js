import Jwt from 'jsonwebtoken';

import TokenApi from '../../xcoobee/api/TokenApi';

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
   * @param {string} apiKey - Your API key.
   * @param {string} apiSecret - Your API secret.
   * @param {boolean} fresh - Flag indicating whether to force a fresh API access
   *   token instead of returning a cached version.
   *
   * @returns {Promise<string>} An API access token for the specified API key/secret
   *   pair.
   */
  get(apiKey, apiSecret, fresh) {
    const key = `${apiKey}:${apiSecret}`;

    if (fresh !== true && key in this._.internalCache) {
      const apiAccessToken = this._.internalCache[key];

      // Assert that token is not expired or is not about to expire.
      const jwtTokenPayload = Jwt.decode(apiAccessToken);
      const exp = jwtTokenPayload.exp;
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
    })
      .then((apiAccessToken) => {
        this._.internalCache[key] = apiAccessToken;
        return Promise.resolve(apiAccessToken);
      });
  }

}

export default ApiAccessTokenCache;
