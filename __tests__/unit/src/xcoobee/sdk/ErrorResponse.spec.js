const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');

describe('ErrorResponse', () => {

  describe('constructor', () => {

    it('should create Response instance', () => {
      const response = new ErrorResponse(400, { message: 'error' });

      expect(response.code).toBe(400);
      expect(response.error.message).toBe('error');
    });

  });

});
