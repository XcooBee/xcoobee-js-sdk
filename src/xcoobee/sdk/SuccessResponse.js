import Response from './Response';

class SuccessResponse extends Response {

  constructor(result) {
    super({
      code: 200,
      error: null,
      result,
    });
  }

}

export default SuccessResponse;
