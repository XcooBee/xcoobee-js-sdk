const Config = require('./Config');
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
