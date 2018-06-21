/**
 * The Users service.
 */
class Users {

  constructor(config) {
    this._ = {
      config: config || null,
    };
  }

  set config(config) {
    this._.config = config;
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} userId
   * @param {*} first
   * @param {*} after
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  getConversation(userId, first, after, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * TODO: Document this function.
   *
   * @param {*} first
   * @param {*} after
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  getConversations(first, after, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Fetches the user for the specified authentication credentials.
   *
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  getUser(config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

  /**
   * Sends a message to a user.
   *
   * @param {string} message
   * @param {*} consentId
   * @param {*} breachId
   * @param {Config} [config] - The configuration to use instead of the default.
   *
   * @returns {Promise<?>} TODO: Document structure.
   *
   * @throws XcooBeeError
   */
  sendUserMessage(message, consentId, breachId, config) {
    // TODO: To be implemented.
    throw Error('NotYetImplemented');
  }

}// eo class Users

export default Users;
