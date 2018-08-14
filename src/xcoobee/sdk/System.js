import CampaignApi from '../../xcoobee/api/CampaignApi';
import EventsApi from '../../xcoobee/api/EventsApi';
import EventSubscriptionsApi from '../../xcoobee/api/EventSubscriptionsApi';

import XcooBeeError from '../../xcoobee/core/XcooBeeError';

import ErrorResponse from './ErrorResponse';
import SdkUtils from './SdkUtils';
import SuccessResponse from './SuccessResponse';

/**
 * The System service.
 */
class System {

  constructor(config, apiAccessTokenCache, usersCache) {
    this._ = {
      apiAccessTokenCache,
      config: config || null,
      usersCache,
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
  async addEventSubscription(events, campaignId, config) {
    this._assertValidState();
    const resolvedCampaignId = SdkUtils.resolveCampaignId(campaignId, config, this._.config);
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const eventSubscriptions = await EventSubscriptionsApi.addEventSubscription(
        apiUrlRoot, apiAccessToken, events, resolvedCampaignId
      );
      const response = new SuccessResponse(eventSubscriptions);
      return response;
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
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
  async deleteEventSubscription(events, campaignId, config) {
    this._assertValidState();
    const resolvedCampaignId = SdkUtils.resolveCampaignId(campaignId, config, this._.config);
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const deletedCount = await EventSubscriptionsApi.deleteEventSubscription(
        apiUrlRoot, apiAccessToken, events, resolvedCampaignId
      );
      const response = new SuccessResponse(deletedCount);
      return response;
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
  }

  /**
   * TODO: Document this function.
   *
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>}
   */
  async getEvents(config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret)
      const userCursor = user.cursor;
      const events = await EventsApi.getEvents(apiUrlRoot, apiAccessToken, userCursor);
      const response = new SuccessResponse(events);
      return response;
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
  }

  /**
   * Lists the current event subscriptions for the specified campaign.
   *
   * @param {CampaignId} [campaignId] - The ID of the campaign for which to list the
   *   event subscriptions.  If `null` or `undefined`, then the campaign ID from the
   *   overriding config will be used.  If `config.campaignId` is `null` or
   *   `undefined`, then the campaign ID from the default config will be used.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  async listEventSubscriptions(campaignId, config) {
    this._assertValidState();
    const resolvedCampaignId = SdkUtils.resolveCampaignId(campaignId, config, this._.config);
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const eventSubscriptions = await EventSubscriptionsApi.listEventSubscriptions(
        apiUrlRoot, apiAccessToken, resolvedCampaignId
      );
      const response = new SuccessResponse(eventSubscriptions);
      return response;
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
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
  async ping(config) {
    this._assertValidState();
    const resolvedCampaignId = SdkUtils.resolveCampaignId(null, config, this._.config);
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret)
      const pgpPublicKey = user.pgp_public_key;

      let err = null;
      if (pgpPublicKey) {
        const campaignInfo = await CampaignApi.getCampaignInfo(apiUrlRoot, apiAccessToken, resolvedCampaignId);
        if (campaignInfo) {
          const response = new SuccessResponse(true);
          return response;
        }
        err = new XcooBeeError('Campaign not found.');
      }
      else {
        err = new XcooBeeError('PGP key not found.');
      }
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
  }

}// eo class System

export default System;
