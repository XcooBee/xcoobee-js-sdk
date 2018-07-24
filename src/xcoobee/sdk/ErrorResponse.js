import Response from './Response';

class ErrorResponse extends Response {

  constructor(code, errors) {
    super({
      code,
      errors,
    });
  }

}

export default ErrorResponse;
