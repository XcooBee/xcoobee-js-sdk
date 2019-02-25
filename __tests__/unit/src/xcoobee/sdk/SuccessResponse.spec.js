const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');

describe('SuccessResponse', () => {

  describe('constructor', () => {

    it('should create Response instance', () => {
      const response = new SuccessResponse('data');

      expect(response.code).toBe(200);
      expect(response.error).toBeNull();
      expect(response.result).toBe('data');
    });

  });

});
