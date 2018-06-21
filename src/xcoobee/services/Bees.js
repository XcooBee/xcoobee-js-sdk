/**
 * The Bees service.
 */
class Bees {

  constructor(config) {
    this._ = {
      config: config || null,
    };
  }

  set config(config) {
    this._.config = config;
  }

  /**
   * Returns a list of bees in the system that your account is able to hire that
   * match the specified search text.
   *
   * ```js
   * listBees('social')
   *   .then((res) => {
   *     // TODO: Handle response.
   *     let { code, data, errors, time } = res;
   *     if (code >= 300) {
   *       console.error(errors);
   *       return;
   *     }
   *     let { bee-systemname, bee-label, bee-cost, cost-type } = data;
   *   })
   * ```
   *
   * @param {string} searchText - The search text.  It is a string of keywords to
   *  search for in the bee system name or label in the language of your account.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  listBees(searchText, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   *
   * @param {string[]} bees - A mapping of bee names to bee parameters.
   * @param {string} bees<key> - The bee name.
   * @param {Object} bees<value> - The bee parameters.
   * @param {Object} options - The bee take off options.
   * @param {Object} options.process -
   * @param {Array<email|XcooBeeId>} [options.process.destinations] -
   * @param {?} options.process.fileNames -
   * @param {Object} [options.process.userReference] -
   * @param {?} [subscriptions]
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  takeOff(bees, options, subscriptions, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Uploads specified files to XcooBee.
   *
   * @param {string[]} files - File paths of the files on the local file system
   *   to be uploaded.  For example, 'C:\Temp\MyPic.jpg' or '~/MyPic.jpg`.
   *   TODO: Test what file paths actually work and make sure the documentation is
   *   adequate.  Be sure to show examples of various path types.
   * @param {string} [endpoint] - One of the "outbox" endpoints defined in the
   *   XcooBee UI.  If an endpoint is not specified, then be sure to call the
   *   `takeOff` function afterwards.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  uploadFiles(files, endpoint, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class Bees

export default Bees;
