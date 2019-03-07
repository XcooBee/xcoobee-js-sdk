const Config = require('./Config');
const Sdk = require('./Sdk');

module.exports = {
  sdk: {
    /**
     * A reference to the XcooBee SDK `Config` class.
     *
     * ```js
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
     * const sdk = new XcooBee.Sdk(...);
     * ```
     *
     * @memberof SdkJs
     */
    Sdk,
  },
};
