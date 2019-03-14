const Config = require('./Config');
const Sdk = require('./Sdk');
const Utilities = require('./Utilities');

module.exports = {
  sdk: {
    /**
     * A reference to the XcooBee SDK `Config` class.
     *
     * ```js
     * const config = new XcooBee.sdk.Config({ ... });
     * ```
     *
     * @memberof SdkJs
     */
    Config,
    /**
     * A reference to the XcooBee `Sdk` class.
     *
     * ```js
     * const sdk = new XcooBee.sdk.Sdk(...);
     * ```
     *
     * @memberof SdkJs
     */
    Sdk,
    /**
     * A reference to XcooBee additional helpers and utilities
     * that can be used independently of SDK
     *
     * ```js
     * XcooBee.sdk.Utilities.uploadFile(file, policy)
     *  .then(...);
     * ```
    */
    Utilities,
  },
};
