import ConversationsApi from '../../xcoobee/api/ConversationsApi';

import ErrorResponse from './ErrorResponse';
import SdkUtils from './SdkUtils';
import SuccessResponse from './SuccessResponse';

/**
 * The Users service.
 */
class Users {

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
   * Fetches a page of conversations with the given target cursor.
   *
   * @param {string} targetCursor
   * @param {number} [first]
   * @param {string} [after]
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<SuccessResponse|ErrorResponse, undefined>}
   * @property {number} code - The response status code.
   * @property {Error} [error] - The response error if status is not successful.
   * @property {string} [error.message] - The error message.
   * @property {string} request_id - The ID of the request generated by the XcooBee
   *   system.
   * @property {Object} [result] - The result of the response if status is successful.
   * @property {Note[]} result.data - A page of conversations (aka notes).
   * @property {Object} [result.page_info] - The page information.
   * @property {boolean} result.page_info.has_next_page - Flag indicating whether there is
   *   another page of data to may be fetched.
   * @property {string} result.page_info.end_cursor - The end cursor.
   *
   * @throws {XcooBeeError}
   */
  async getConversation(targetCursor, first, after, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const conversationsPage = await ConversationsApi.getConversation(
        apiUrlRoot, apiAccessToken, targetCursor, first, after
      );
      const response = new SuccessResponse(conversationsPage);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Fetches a page of the user's conversations.
   *
   * @param {number} [first]
   * @param {string} [after]
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<SuccessResponse|ErrorResponse, undefined>}
   * @property {number} code - The response status code.
   * @property {Error} [error] - The response error if status is not successful.
   * @property {string} [error.message] - The error message.
   * @property {string} request_id - The ID of the request generated by the XcooBee
   *   system.
   * @property {Object} [result] - The result of the response if status is successful.
   * @property {Note[]} result.data - A page of conversations (aka notes).
   * @property {Object} [result.page_info] - The page information.
   * @property {boolean} result.page_info.has_next_page - Flag indicating whether there is
   *   another page of data to may be fetched.
   * @property {string} result.page_info.end_cursor - The end cursor.
   *
   * @throws {XcooBeeError}
   */
  async getConversations(first, after, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret)
      const userCursor = user.cursor;
      const conversationsPage = await ConversationsApi.getConversations(
        apiUrlRoot, apiAccessToken, userCursor, first, after
      );
      const response = new SuccessResponse(conversationsPage);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Fetches the user for the specified authentication credentials.
   *
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<SuccessResponse|ErrorResponse, undefined>}
   * @property {number} code - The response status code.
   * @property {Error} [error] - The response error if status is not successful.
   * @property {string} [error.message] - The error message.
   * @property {string} request_id - The ID of the request generated by the XcooBee
   *   system.
   * @property {Object} [result] - The result of the response if status is successful.
   * @property {Note} result.data - Some information on the user.
   * @property {string} result.data.cursor -
   * @property {string} result.data.pgp_public_key -
   * @property {string} result.data.xcoobee_id -
   *
   * @throws {XcooBeeError}
   */
  async getUser(config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const userInfo = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret);
      const response = new SuccessResponse({ data: userInfo });
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Sends a message to a consent destination or a breach destination.
   *
   * @param {string} message
   * @param {*} consentId
   * @param {*} breachId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<SuccessResponse|ErrorResponse, undefined>}
   * @property {number} code - The response status code.
   * @property {Error} [error] - The response error if status is not successful.
   * @property {string} [error.message] - The error message.
   * @property {string} request_id - The ID of the request generated by the XcooBee
   *   system.
   * @property {Object} [result] - The result of the response if status is successful.
   * @property {Note} result.data - Some information on the newly created note.
   * @property {string} result.data.target_cursor -
   *
   * @throws {XcooBeeError}
   */
  async sendUserMessage(message, consentId, breachId, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret)
      const userCursor = user.cursor;
      const note = await ConversationsApi.sendUserMessage(
        apiUrlRoot, apiAccessToken, message, userCursor, consentId, breachId
      );
      const response = new SuccessResponse({ data: note });
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

}// eo class Users

export default Users;
