const Config = require('./Config');
const ConfigUtils = require('./ConfigUtils');
const Sdk = require('./Sdk');

/**
 * The XcooBee SDK JavaScript module. It may be imported with whatever name you
 * prefer. In this API documentation, we'll use `SdkJs`.
 *
 * ```js
 * const XcooBee = require('xcoobee-sdk');
 * ```
 *
 * @module SdkJs
 */
module.exports = {
  /**
   * A reference to the XcooBee SDK `Config` class.
   *
   * ```js
   * const XcooBee = require('xcoobee-sdk');
   *
   * const config = new XcooBee.Config({ ... });
   * ```
   *
   * @memberof SdkJs
   */
  Config,
  /**
   * A reference to the XcooBee SDK `ConfigUtils` namespace.
   *
   * ```js
   * const XcooBee = require('xcoobee-sdk');
   *
   * XcooBee.ConfigUtils.createFromFile(...)
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
   * const XcooBee = require('xcoobee-sdk');
   *
   * const sdk = new XcooBee.Sdk(...);
   * ```
   *
   * @memberof SdkJs
   */
  Sdk,
};
