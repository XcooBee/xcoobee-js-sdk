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
   * TODO: Document this function.
   *
   * @param {*} targetCursor
   * @param {*} first
   * @param {*} after
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  async getConversation(targetCursor, first, after, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const conversations = await ConversationsApi.getConversation(
        apiUrlRoot, apiAccessToken, targetCursor, first, after
      );
      const response = new SuccessResponse(conversations);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} first
   * @param {*} after
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  async getConversations(first, after, config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const apiAccessToken = await this._.apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
      const user = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret)
      const userCursor = user.cursor;
      const conversations = await ConversationsApi.getConversations(
        apiUrlRoot, apiAccessToken, userCursor, first, after
      );
      const response = new SuccessResponse(conversations);
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
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  async getUser(config) {
    this._assertValidState();
    const apiCfg = SdkUtils.resolveApiCfg(config, this._.config);
    const { apiKey, apiSecret, apiUrlRoot } = apiCfg;

    try {
      const userInfo = await this._.usersCache.get(apiUrlRoot, apiKey, apiSecret);
      const response = new SuccessResponse(userInfo);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

  /**
   * Sends a message to a user.
   *
   * @param {string} message
   * @param {*} consentId
   * @param {*} breachId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<Response>} TODO: Document structure.
   *
   * @throws XcooBeeError
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
      const response = new SuccessResponse(note);
      return response;
    } catch (err) {
      return new ErrorResponse(400, err);
    }
  }

}// eo class Users

export default Users;
