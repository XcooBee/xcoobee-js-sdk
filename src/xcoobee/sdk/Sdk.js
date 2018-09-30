import ApiAccessTokenCache from '../../xcoobee/api/ApiAccessTokenCache';
import UsersCache from '../../xcoobee/api/UsersCache';

import Bees from './Bees';
import Consents from './Consents';
import Inbox from './Inbox';
import System from './System';
import Users from './Users';

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
 * const xcooBeeSdk = new Sdk(config);
 * ```
 */
class Sdk {

  /**
   *
   * @param {Object} [config] The default configuration to use when a configuration
   *   is not specified with individual SDK calls.
   */
  constructor(config) {
    let cfg = config || null;
    let apiAccessTokenCache = new ApiAccessTokenCache();
    let usersCache = new UsersCache(apiAccessTokenCache);
    this._ = {
      bees: new Bees(cfg, apiAccessTokenCache, usersCache),
      config: cfg,
      consents: new Consents(cfg, apiAccessTokenCache, usersCache),
      inbox: new Inbox(cfg, apiAccessTokenCache, usersCache),
      system: new System(cfg, apiAccessTokenCache, usersCache),
      users: new Users(cfg, apiAccessTokenCache, usersCache),
    };
  }

  /**
   * @returns {Bee}
   */
  get bees() {
    return this._.bees;
  }

  /**
   * @returns {Config}
   */
  get config() {
    return this._.config;
  }

  /**
   * @param {Config} config
   */
  set config(config) {
    // TODO: Validate config.
    this._.bees.config = config;
    this._.consents.config = config;
    this._.inbox.config = config;
    this._.system.config = config;
    this._.users.config = config;
    this._.config = config;
  }

  /**
   * @returns {Consents}
   */
  get consents() {
    return this._.consents;
  }

  /**
   * @returns {Inbox}
   */
  get inbox() {
    return this._.inbox;
  }

  /**
   * @returns {System}
   */
  get system() {
    return this._.system;
  }

  /**
   * @returns {Users}
   */
  get users() {
    return this._.users;
  }

}// eo class Sdk

export default Sdk;
