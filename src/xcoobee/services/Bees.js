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
   * Returns a list of bees that match the specified search text.
   *
   * @param {string} searchText - The search text.  It is used to match on TODO:
   *   Document what it is used to match on. Bee name? Other?
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  listBees(searchText, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   *
   * @param {Object} bees - A mapping of bee names to bee parameters.
   * @param {string} bees<key> - The bee name.
   * @param {Object} bees<value> - The bee parameters.
   * @param {Object} options - The bee take off options.
   * @param {Object} options.process -
   * @param {Array<email|XcooBeeId>} [options.process.destinations] -
   * @param {?} options.process.fileNames -
   * @param {Object} [options.process.userReference] -
   * @param {?} [subscriptions]
   * @param {Config} [config] - The configuration to use instead of the default.
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
   * Uploads specified files.
   *
   * @param {string[]} files - TODO: Document what the files should look like.
   *   Are they file paths? Absolute? Relative? Relative to what?
   * @param {string} endpoint - TODO: Document available endpoint values.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  uploadFiles(files, endpoint, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class Bees

export default Bees;
