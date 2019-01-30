/**
 * The configuration to use with a particular SDK instance.
 *
 * @param {Object} values - The configuration data.
 * @param {string} values.apiKey - Your API key.
 * @param {string} values.apiSecret - Your API secret associated with your API key.
 * @param {string} values.apiUrlRoot - The root of the API URL.
 * @param {string} [values.campaignId] - The default campaign ID to use if a campaign
 *   ID is not explicitly set during an SDK call.
 * @param {boolean} [values.encrypt=false] - Flag indicating whether data should be
 *   encrypted using the specified PGP password and secret.
 * @param {string} [values.pgpPassword] - The PGP password.  Required when
 *   `values.encrypt` is `true`.
 * @param {string} [values.pgpSecret] - The PGP secret.  Required when `data.values`
 *   is `true`.
 *
 * @throws {TypeError} when configuration data is invalid.
 *
 * @see {@link Sdk.ConfigUtils} for other ways to construct configuration
 *   instances.
 */
class Config {

  /* eslint-disable-next-line valid-jsdoc */
  /**
   * Constructs an immutable configuration.
   */
  constructor(values) {
    if (!values) {
      throw TypeError('Config `data` is required.');
    }
    const { apiKey, apiSecret, apiUrlRoot } = values;
    let {
      campaignId,
      encrypt,
      pgpPassword,
      pgpSecret,
    } = values;
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
      (campaignId !== null && typeof campaignId !== 'string')
      || (typeof campaignId === 'string' && campaignId.length === 0)
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
   * The XcooBee API key.
   *
   * @readonly
   * @returns {string}
   */
  get apiKey() {
    return this._.apiKey;
  }

  /**
   * The XcooBee API secret.
   *
   * @readonly
   * @returns {string}
   */
  get apiSecret() {
    return this._.apiSecret;
  }

  /**
   * The XcooBee API URL root.
   *
   * @readonly
   * @returns {string}
   */
  get apiUrlRoot() {
    return this._.apiUrlRoot;
  }

  /**
   * The default campaign ID.  This is used if a campaign ID is not explicitly set
   * during an SDK call.
   *
   * @readonly
   * @returns {string}
   */
  get campaignId() {
    return this._.campaignId;
  }

  /**
   * @readonly
   * @returns {boolean}
   */
  get encrypt() {
    return this._.encrypt;
  }

  /**
   * @readonly
   * @returns {string}
   */
  get pgpPassword() {
    return this._.pgpPassword;
  }

  /**
   * @readonly
   * @returns {string}
   */
  get pgpSecret() {
    return this._.pgpSecret;
  }

}

module.exports = Config;
