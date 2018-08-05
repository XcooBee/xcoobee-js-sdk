import ApiAccessTokenCache from '../../xcoobee/api/ApiAccessTokenCache';
import UsersCache from '../../xcoobee/api/UsersCache';

import Bees from './Bees';
import Consents from './Consents';
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
      system: new System(cfg, apiAccessTokenCache, usersCache),
      users: new Users(cfg, apiAccessTokenCache, usersCache),
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
    this._.bees.config = config;
    this._.consents.config = config;
    this._.system.config = config;
    this._.users.config = config;
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

}// eo class Sdk

export default Sdk;
