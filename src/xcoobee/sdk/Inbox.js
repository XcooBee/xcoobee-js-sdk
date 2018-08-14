import InboxApi from '../../xcoobee/api/InboxApi';

import ErrorResponse from './ErrorResponse';
import SdkUtils from './SdkUtils';
import SuccessResponse from './SuccessResponse';

/**
 * The Inbox service.
 */
class Inbox {

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
   * Deletes an item from the inbox with the specified message ID.
   *
   * @param {string} messageId
   * @param {Config} [config]
   *
   * @returns {Promise<Response>} - The response.
   * @returns {Promise<Object>} - The results.
   * @returns {string} return.trans_id - The transaction ID.  Will be `null` if no
   *   inbox item with the specified message ID exists.
   */
  async deleteInboxItem(messageId, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret);
      const userCursor = user.cursor;
      const results = await InboxApi.deleteInboxItem(apiUrlRoot, apiAccessToken, userCursor, messageId);
      const response = new SuccessResponse(results);
      return response;
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
  }

  /**
   * Fetches an item from the inbox with the specified message ID.
   *
   * @param {string} messageId
   * @param {Config} [config]
   *
   * @returns {Promise<Response>} - The response.
   * @returns {Promise<Object>} - The results.
   * @returns {InboxItemDetails} return.inbox_item - The inbox item details.
   * @returns {string} return.inbox_item.download_link - The inbox item download link.
   * @returns {InboxItem} return.inbox_item.info - The inbox item info.
   */
  async getInboxItem(messageId, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret);
      const userCursor = user.cursor;
      const results = await InboxApi.getInboxItem(apiUrlRoot, apiAccessToken, userCursor, messageId);
      const response = new SuccessResponse(results);
      return response;
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
  }

  /**
   * Fetch a page of items from the inbox.
   *
   * @param {string} [startMessageId]
   * @param {Config} [config]
   *
   * @returns {Promise<Response>} - The response.
   * @returns {Object} return.response.results - The results.
   * @returns {Object} return.response.results.inbox - A page of the inbox.
   * @returns {InboxItem[]} return.response.results.inbox.data - Inbox items for this page.
   * @returns {PageInfo} return.response.results.inbox.page_info - The page info.
   */
  async listInbox(startMessageId, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const results = await InboxApi.listInbox(apiUrlRoot, apiAccessToken, startMessageId);
      const response = new SuccessResponse(results);
      return response;
    } catch (err) {
      const code = 400;
      const errors = [err];
      return new ErrorResponse(code, errors);
    }
  }

}// eo class Inbox

export default Inbox;
