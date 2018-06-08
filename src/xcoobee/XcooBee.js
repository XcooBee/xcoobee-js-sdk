/**
 * The SDK entry point.
 *
 * ```js
 * const config = {
 *   apiKey: '...',
 *   apiSecret: '...',
 *   campaignId: null,
 *   encrypt: true,
 *   pgpPassword: null,
 *   pgpSecret: null,
 * };
 * const xcooBee = new XcooBee(config);
 * ```
 */
class XcooBee {

  /**
   *
   * @param {Object} [config] The default configuration to use when a configuration
   *   is not specified with individual SDK calls.
   */
  constructor(config) {
    this._ = {
      bees: null, // TODO: Instantiate Bees service.
      config: config || null,
      consents: null, // TODO: Instantiate Consents service.
      system: null, // TODO: Instantiate System service.
      users: null, // TODO: Instantiate Users service.
    }
  }

  get bees() {
    return this._.bees;
  }

  get config() {
    return this._.config;
  }

  set config(config) {
    // TODO: Validate config.
    this._.config = config;
  }

  get consents() {
    return this._.consents;
  }

  get system() {
    return this._.system;
  }

  get users() {
    return this._.users;
  }

}// eo class XcooBee

export default XcooBee;
