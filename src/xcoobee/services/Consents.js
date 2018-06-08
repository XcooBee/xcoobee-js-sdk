/**
 * The Consents service.
 */
class Consents {

  constructor(config) {
    this._ = {
      config: config || null,
    };
  }

  /**
   * Activates the campaign with the specified ID.
   *
   * @param {string} [campaignId] - The ID of the campaign to activate.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  activateCampaign(campaignId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Creates a new campaign.
   *
   * @param {Object} data - The campaign data.  TODO: Document the structure.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  createCampaign(data, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} consentId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  confirmConsentChange(consentId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} consentId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  confirmDataDelete(consentId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Fetches the campaign details for the campaign with the specified ID.
   *
   * @param {string} [campaignId] - The ID of the campaign to fetch.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  getCampaignInfo(campaignId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} consentId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  getConsentData(consentId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {XcooBeeId} xcooBeeId
   * @param {*} campaignId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  getCookieConsent(xcooBeeId, campaignId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Fetches the list of all campaigns.
   *
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  listCampaigns(config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Modifies the campaign with the specified ID.
   *
   * @param {string} [campaignId] - The ID of the campaign to modify.
   * @param {Object} data - The campaign data.  TODO: Document the structure.
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  modifyCampaign(campaignId, data, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {XcooBeeId} xcooBeeId
   * @param {*} refId
   * @param {*} campaignId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  requestConsent(xcooBeeId, refId, campaignId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {string} message
   * @param {*} consentId
   * @param {*} requestRef
   * @param {*} filename
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  setUserDataResponse(message, consentId, requestRef, filename, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class Consents

export default Consents;
