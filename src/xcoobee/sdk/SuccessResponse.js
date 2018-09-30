import Response from './Response';

/**
 * A response representing a successful response. That is, the SDK function call
 * completed successfully.
 */
class SuccessResponse extends Response {

  /**
   * @param {*} result
   */
  constructor(result) {
    super({
      code: 200,
      error: null,
      result,
    });
  }

}

export default SuccessResponse;
