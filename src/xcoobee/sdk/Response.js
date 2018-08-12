/**
 * Represents a response from the SDK calls.
 *
 * @immutable
 */
class Response {

  /**
   *
   * @param {Object} info
   * @param {number} info.code
   * @param {?} [info.errors]
   * @param {mixed} [info.results]
   */
  constructor(info) {
    // TODO: Validate info.
    if (info.code < 200 || info.code > 599) {
      throw TypeError('`code` must be a valid HTTP status code.');
    }
    this._ = {
      ...info,
      time: new Date, // TODO: Format as: Y-m-d H:i:s.
    };
  }

  get code() {
    return this._.code;
  }

  get results() {
    return this._.results;
  }

  get errors() {
    return this._.errors;
  }

  get time() {
    return this._.time;
  }

}

export default Response;
