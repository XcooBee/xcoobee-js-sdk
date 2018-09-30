/**
 * Represents a response from an SDK function call.
 *
 * @immutable
 */
class Response {

  /**
   * @param {Object} info
   * @param {number} info.code
   * @param {Object} [info.error]
   * @param {string} [info.error.message]
   * @param {*} [info.result]
   */
  constructor(info) {
    if (!info) {
      throw TypeError('Response `info` is required.');
    }
    if (info.code < 200 || info.code > 599) {
      throw TypeError('`code` must be a valid HTTP status code.');
    }
    if (info.code < 300) {
      if (info.result === null || info.result === undefined) {
        throw TypeError('`result` is required for successful responses.');
      }
    }
    else {
      if (info.error === null || info.error === undefined) {
        throw TypeError('`error` is required for non-successful responses.');
      }
      if (info.error.message === null || info.error.message === undefined) {
        throw TypeError('`error.message` is required for non-successful responses.');
      }
    }
    this._ = {
      ...info,
      time: new Date(),
    };
  }

  /**
   * @returns {number}
   */
  get code() {
    return this._.code;
  }

  /**
   * @returns {*}
   */
  get result() {
    return this._.result;
  }

  /**
   * @returns {Object}
   * @property {string} message
   */
  get error() {
    return this._.error;
  }

  /**
   * @returns {Date}
   */
  get time() {
    return this._.time;
  }

  /**
   * @async
   *
   * @returns {Promise<PagingResponse|null, ErrorResponse>}
   */
  async getNextPage() {
    return null;
  }

  /**
   * @returns {boolean} A flag indicating whether there is another page of results
   *   that may be retrieved.
   */
  hasNextPage() {
    return !!this._.hasNextPage;
  };

}

export default Response;
