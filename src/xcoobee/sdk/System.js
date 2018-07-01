/**
 * The System service.
 */
class System {

  constructor(config) {
    this._ = {
      config: config || null,
    };
  }

  set config(config) {
    this._.config = config;
  }

  _assertValidState() {
    if (!this._.config) {
      throw TypeError('Illegal State: Default config has not been set yet.');
    }
  }

  /**
   * Adds an event subscription to web hooks.
   *
   * @param {Map<WebHookName, HandlerName>|Object<WebHookName, HandlerName>} events
   *   - A lookup from web hook names to handler names.
   * @param {CampaignId} [campaignId] - The ID of the campaign for which to subscribe
   *   handlers.  If `null` or `undefined`, then the default campaign ID will be used
   *   from the config.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  addEventSubscription(events, campaignId, config) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Deletes any event subscriptions from the specified campaign.
   *
   * @param {WebHookName[]|Map<WebHookName, *>|Object<WebHookName, *>|Set<WebHookName>} events - The event
   * @param {CampaignId} [campaignId] - The ID of the campaign for which to delete
   *   the event subscriptions.  If `null` or `undefined`, then the default campaign
   *   ID will be used from the config.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  deleteEventSubscription(events, campaignId, config) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Lists the current event subscriptions for the specified campaign.
   *
   * @param {CampaignId} [campaignId] - The ID of the campaign for which to list the
   *   event subscriptions.  If `null` or `undefined`, then the default campaign ID
   *   will be used from the config.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  listEventSubscriptions(campaignId, config) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Can be called to check whether the current configuration will connect to the
   * XcooBee system.  This will return an error if your API user does not have a
   * public PGP key on their profile.
   *
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  ping(config) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class System

export default System;
