import CampaignApi from '../../xcoobee/api/CampaignApi';
import ConsentsApi from '../../xcoobee/api/ConsentsApi';

import ErrorResponse from './ErrorResponse';
import SdkUtils from './SdkUtils';
import SuccessResponse from './SuccessResponse';

/**
 * The Consents service.
 */
class Consents {

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

  // TODO: Document CampaignId
  // TODO: Document CampaignStruct
  // * @returns {string} return.response.results.campaign_name
  // * @returns {?} return.response.results.date_c
  // * @returns {?} return.response.results.date_e
  // * @returns {?} return.response.results.status
  // * @returns {?} return.response.results.xcoobee_targets
  // * @returns {?} return.response.results.xcoobee_targets.xcoobee_id

  // TODO: Document CreateCampaignStruct
  // TODO: Document ConsentId
  // TODO: Document RequestRefId

  /**
   * Activates the campaign with the specified ID.
   *
   * @param {CampaignId} [campaignId] - The ID of the campaign to activate.  If not
   *   specified or is `undefined`, then the default campaign ID is used if set.  If a
   *   campaign ID cannot be resolved, then a `XcooBeeError` will be thrown.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a `CampaignId` as the data.
   * @returns {Response} return.response
   * @returns {CampaignId} return.response.results
   *
   * @throws XcooBeeError
   */
  activateCampaign(campaignId_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented. (Maybe not. Not in PHP SDK.)
    throw Error('NotYetImplemented');
  }

  /**
   * Creates a new campaign.
   *
   * @param {CreateCampaignStruct} data - The data of the campaign to be created.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a `CampaignId` as the data.
   * @returns {Response} return.response
   * @returns {CampaignId} return.response.results
   *
   * @throws XcooBeeError
   */
  createCampaign(data_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented. (Maybe not. Not in PHP SDK.)
    throw Error('NotYetImplemented');
  }

  /**
   * Determines whether data has been changed according to changes requested.
   *
   * @param {ConsentId} consentId - The consent ID of the data being confirmed.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a boolean as the `confirmed` property in the
   *   `results` indicating whether the data has been changed.
   * @returns {Response} return.response
   * @returns {Object} return.response.results
   * @returns {boolean} return.response.results.confirmed
   *
   * @throws XcooBeeError
   */
  async confirmConsentChange(consentId, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const confirmed = await ConsentsApi.confirmConsentChange(apiUrlRoot, apiAccessToken, consentId);
      const response = new SuccessResponse({ confirmed });
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Determines whether data has been deleted/purged from data holder.
   *
   * @param {ConsentId} consentId - The consent ID of the data being confirmed.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a boolean as the data property indicating
   *   whether the data has been deleted/purged.
   * @returns {Response} return.response
   * @returns {boolean} return.response.results
   *
   * @throws XcooBeeError
   */
  confirmDataDelete(consentId_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Fetches the campaign's basic information for the campaign with the specified
   * ID.
   *
   * @param {CampaignId} [campaignId] - The ID of the campaign to fetch.  If not specified
   *   or is `undefined`, then the default campaign ID is used if set.  If a campaign
   *   ID cannot be resolved, then a `XcooBeeError` will be thrown.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a `CampaignStruct` as the data.
   * @returns {Response} return.response
   * @returns {CampaignStruct} return.response.results
   *
   * @throws XcooBeeError
   */
  getCampaignInfo(campaignId_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Fetches the consent data with the specified ID.
   *
   * @param {ConsentId} consentId - The ID of the consent to fetch.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a `ConsentStruct` as the data.
   * @returns {Response} return.response
   * @returns {ConsentStruct} return.response.results
   *
   * @throws XcooBeeError
   */
  async getConsentData(consentId, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const consents = await ConsentsApi.getConsentData(apiUrlRoot, apiAccessToken, consentId);
      const response = new SuccessResponse(consents);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Fetches an existing user's cookie consent information.
   *
   * @param {XcooBeeId} xcooBeeId - The XcooBee ID for which to fetch cookie consent
   *   information.
   * @param {CampaignId} [campaignId] - The ID of the campaign to use.  If not
   *   specified or is `undefined`, then the default campaign ID is used if set.  If a
   *   campaign ID cannot be resolved, then a `XcooBeeError` will be thrown.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a website cookie consent CSV as the data.  The
   *   CSV has the following columns: application, usage, and advertising.  The  first
   *   line in the CSV will be the header containing these columns.
   * @returns {Response} return.response
   * @returns {string} return.response.results
   *
   * @throws XcooBeeError
   */
  getCookieConsent(xcooBeeId_unused, campaignId_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Fetches the list of all campaigns.
   *
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have an array of `CampaignStruct`s as the data.
   * @returns {Response} return.response
   * @returns {CampaignStruct[]} return.response.results
   *
   * @throws XcooBeeError
   */
  async listCampaigns(config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret)
      const userCursor = user.cursor;
      const campaigns = await CampaignApi.getCampaigns(apiUrlRoot, apiAccessToken, userCursor);
      const response = new SuccessResponse(campaigns);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Fetches the list of consents.
   *
   * @param {ConsentStatus} status
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   * @returns {Response} return.response
   *
   * @throws XcooBeeError
   */
  async listConsents(status, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret)
      const userCursor = user.cursor;
      const consents = await ConsentsApi.listConsents(apiUrlRoot, apiAccessToken, userCursor, status);
      const response = new SuccessResponse(consents);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Modifies the campaign with the specified ID.
   *
   * @param {CampaignId} [campaignId] - The ID of the campaign to modify.  If not
   *   specified or is `undefined`, then the default campaign ID is used if set.  If a
   *   campaign ID cannot be resolved, then a `XcooBeeError` will be thrown.
   * @param {Object} data - The campaign data to be modified.  TODO: Document the structure.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a `CampaignId` as the data.
   * @returns {Response} return.response
   * @returns {CampaignId} return.response.results
   *
   * @throws XcooBeeError
   */
  modifyCampaign(campaignId_unused, data_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented. (Maybe not. Not in PHP SDK.)
    throw Error('NotYetImplemented');
  }

  /**
   * Requests consent from the specified user.
   *
   * @param {XcooBeeId} xcooBeeId - The XcooBee ID from which consent is being
   *   requested.
   * @param {RequestRefId} reqRefId - A request reference ID generated by you that
   *   identifies this request.  This ID will be returned in the `ConsentApproved`
   *   and `ConsentDeclined` consent events.  May be a maximum of 64 characters long.
   * @param {CampaignId} [campaignId] - The ID of the campaign for which consent is
   *   being requested.  If not specified or is `undefined`, then the default campaign
   *   ID is used if set.  If a campaign ID cannot be resolved, then a `XcooBeeError`
   *   will be thrown.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a boolean as the data property indicating
   *   whether the request was successful.  Note: It does **NOT** indicate whether
   *   the consent was approved or declined.
   * @returns {Response} return.response
   * @returns {boolean} return.response.results
   *
   * @throws XcooBeeError
   */
  requestConsent(xcooBeeId_unused, reqRefId_unused, campaignId_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Sends a response to a user-data request.  This call will send a message to the
   * user's communication center.
   *
   * Standard hiring points will be deducted for this.
   *
   * @param {string} message - The message to be sent to the user.
   * @param {ConsentId} consentId - The ID of the consent to which you are responding.
   * @param {RequestRefId} reqRefId - A request reference ID generated by you that
   *   identifies this request.  This ID will be returned in the `UserDataRequest`
   *   consent events.  May be a maximum of 64 characters long.
   * @param {string} filename - The user's data being requested.
   * @param {Config} [config] - If specified, the configuration to use instead of the
   *   default.
   *
   * @returns {Promise<Response>} A promise that resolves to a `Response` instance.
   *   A successful response will have a boolean as the data property indicating
   *   whether the message was successfully sent.
   * @returns {Response} return.response
   * @returns {boolean} return.response.results
   *
   * @throws XcooBeeError
   */
  setUserDataResponse(message_unused, consentId_unused, requestRef_unused, filename_unused, config_unused) {
    this._assertValidState();
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class Consents

export default Consents;
