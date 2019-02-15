const Response = require('./Response');

/**
 * A response representing an error response, meaning the requested operation
 * did not fully complete successfully.
 */
class ErrorResponse extends Response {

  /**
   * @param {number} code
   * @param {Object} error
   * @param {string} error.message
   */
  constructor(code, error) {
    super({
      code,
      error,
    });
  }

}

module.exports = ErrorResponse;
