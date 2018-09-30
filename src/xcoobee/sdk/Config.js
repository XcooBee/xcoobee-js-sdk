/**
 * The configuration to use with the SDK.
 *
 * @immutable
 * @see xcoobee/sdk/ConfigUtils
 */
class Config {

  /**
   * Constructs a new `Config` object.
   *
   * @param {Object} data - The configuration data.
   * @param {string} data.apiKey - Your API key.
   * @param {string} data.apiSecret - Your API secret associated with your API key.
   * @param {string} data.apiUrlRoot - The root of the API URL.
   * @param {string} [data.campaignId] - The default campaign ID to use if a campaign
   *   ID is not explicitly set during an SDK call.
   * @param {boolean} [data.encrypt=false] - Flag indicating whether data should be
   *   encrypted using the specified PGP password and secret.
   * @param {string} [data.pgpPassword] - The PGP password.  Required when
   *   `data.encrypt` is `true`.
   * @param {string} [data.pgpSecret] - The PGP secret.  Required when `data.encrypt`
   *   is `true`.
   *
   * @throws TypeError
   */
  constructor(data) {
    if (!data) {
      throw TypeError('Config `data` is required.');
    }
    let {
      apiKey, apiSecret, apiUrlRoot, campaignId, encrypt, pgpPassword, pgpSecret,
    } = data;
    campaignId = campaignId === undefined ? null : campaignId;
    encrypt = encrypt === undefined ? false : encrypt;
    pgpPassword = pgpPassword === undefined ? null : pgpPassword;
    pgpSecret = pgpSecret === undefined ? null : pgpSecret;

    if (!apiKey || typeof apiKey !== 'string') {
      throw new TypeError('API key is required.');
    }

    if (!apiSecret || typeof apiSecret !== 'string') {
      throw new TypeError('API secret is required.');
    }

    if (!apiUrlRoot || typeof apiUrlRoot !== 'string') {
      throw new TypeError('API URL root is required.');
    }

    if (
      (campaignId !== null && typeof campaignId !== 'string') ||
      (typeof campaignId === 'string' && campaignId.length === 0)
    ) {
      throw new TypeError(
        'Default campaign ID must be null or a valid campaign ID.'
      );
    }

    if (encrypt) {
      if (!pgpPassword) {
        throw new TypeError('PGP password is required when encrypt is true.');
      }
      if (!pgpSecret) {
        throw new TypeError('PGP secret is required when encrypt is true.');
      }
    }

    this._ = {
      apiKey,
      apiSecret,
      apiUrlRoot,
      campaignId,
      encrypt,
      pgpPassword,
      pgpSecret,
    };
  }

  /**
   * @returns {string}
   */
  get apiKey() {
    return this._.apiKey;
  }

  /**
   * @returns {string}
   */
  get apiSecret() {
    return this._.apiSecret;
  }

  /**
   * @returns {string}
   */
  get apiUrlRoot() {
    return this._.apiUrlRoot;
  }

  /**
   * The default campaign ID.  This is used if a campaign ID is not explicitly set
   * during an SDK call.
   */
  get campaignId() {
    return this._.campaignId;
  }

  /**
   * @returns {boolean}
   */
  get encrypt() {
    return this._.encrypt;
  }

  /**
   * @returns {string}
   */
  get pgpPassword() {
    return this._.pgpPassword;
  }

  /**
   * @returns {string}
   */
  get pgpSecret() {
    return this._.pgpSecret;
  }

}

export default Config;
