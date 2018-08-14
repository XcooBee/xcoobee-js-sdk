import Response from './Response';

class ErrorResponse extends Response {

  constructor(code, error) {
    super({
      code,
      error,
    });
  }

}

export default ErrorResponse;
