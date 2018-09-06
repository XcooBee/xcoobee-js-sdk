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
   * @param {Object} [info.error]
   * @param {string} [info.error.message]
   * @param {mixed} [info.result]
   */
  constructor(info) {
    // TODO: Validate info.
    if (info.code < 200 || info.code > 599) {
      throw TypeError('`code` must be a valid HTTP status code.');
    }
    this._ = {
      ...info,
      time: new Date(),
    };
  }

  get code() {
    return this._.code;
  }

  get result() {
    return this._.result;
  }

  get error() {
    return this._.error;
  }

  get time() {
    return this._.time;
  }

  /**
   * @async
   *
   * @returns {Promise<PagingResponse, ErrorResponse}
   */
  async getNextPage() {
    return null;
  }

  hasNextPage() {
    return !!this._.hasNextPage;
  };

}

export default Response;
