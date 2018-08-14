import Response from './Response';

class SuccessResponse extends Response {

  constructor(results) {
    super({
      code: 200,
      error: null,
      results,
    });
  }

}

export default SuccessResponse;
