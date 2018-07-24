import Response from './Response';

class SuccessResponse extends Response {

  constructor(data) {
    super({
      code: 200,
      data,
      errors: null,
    });
  }

}

export default SuccessResponse;
