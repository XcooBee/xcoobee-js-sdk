/**
 * The System service.
 */
class System {

  constructor(config) {
    this._ = {
      config: config || null,
    };
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} events
   * @param {*} campaignId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  addEventSubscription(events, campaignId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} events
   * @param {*} campaignId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  deleteEventSubscription(events, campaignId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} campaignId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  listEventSubscriptions(campaignId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  ping(config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class System

export default System;
