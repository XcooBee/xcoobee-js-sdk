const Config = require('./Config');
const ConfigUtils = require('./ConfigUtils');
const Sdk = require('./Sdk');

/**
 * The XcooBee SDK JavaScript module. It may be imported with whatever name you
 * prefer. In this API documentation, we'll use `SdkJs`.
 *
 * ```js
 * import SdkJs from '@xcoobee/sdk-js';
 * ```
 *
 * @module SdkJs
 */
module.exports = {
  /**
   * A reference to the XcooBee SDK `Config` class.
   *
   * ```js
   * import SdkJs from '@xcoobee/sdk-js';
   *
   * const config = new SdkJs.Config({ ... });
   * ```
   *
   * @memberof SdkJs
   */
  Config,
  /**
   * A reference to the XcooBee SDK `ConfigUtils` namespace.
   *
   * ```js
   * import SdkJs from '@xcoobee/Sdk-js';
   *
   * SdkJs.ConfigUtils.createFromFile(...)
   *   .then(config => {
   *     // Do something with the config such as
   *     // pass it to the `Sdk` constuctor.
   *   });
   * ```
   *
   * @memberof SdkJs
   */
  ConfigUtils,
  /**
   * A reference to the XcooBee `Sdk` class.
   *
   * ```js
   * import SdkJs from '@xcoobee/sdk-js';
   *
   * const anSdk = new SdkJs.Sdk(...);
   * ```
   *
   * @memberof SdkJs
   */
  Sdk,
};
