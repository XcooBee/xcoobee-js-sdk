const Response = require('../../../../../src/xcoobee/sdk/Response');

describe('Response', () => {

  describe('constructor', () => {

    it('should throw an error if info not provided', () => {
      try {
        new Response();
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Response `info` is required.');
      }
    });

    it('should throw an error if status code less than 200', () => {
      try {
        new Response({ code: 199 });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('`code` must be a valid HTTP status code.');
      }
    });

    it('should throw an error if status code more than 599', () => {
      try {
        new Response({ code: 600 });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('`code` must be a valid HTTP status code.');
      }
    });

    it('should throw an error if status code is 200 but result not presented', () => {
      try {
        new Response({ code: 200 });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('`result` is required for successful responses.');
      }
    });

    it('should throw an error if status code is 400 but error not presented', () => {
      try {
        new Response({ code: 400 });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('`error` is required for non-successful responses.');
      }
    });

    it('should throw an error if status code is 400 but error message not presented', () => {
      try {
        new Response({ code: 400, error: {} });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('`error.message` is required for non-successful responses.');
      }
    });

    it('should create Response instance', () => {
      const response = new Response({ code: 200, result: 'data' });

      expect(response.code).toBe(200);
      expect(response.result).toBe('data');
      expect(response.error).toBeUndefined();
    });

  });

});
