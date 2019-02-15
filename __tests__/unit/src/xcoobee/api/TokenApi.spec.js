const jest = require('jest');

jest.mock('cross-fetch');

const fetch = require('cross-fetch');

const { getApiAccessToken } = require('../../../../../src/xcoobee/api/TokenApi');
const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

describe('TokenApi', () => {

  describe('getApiAccessToken', () => {

    const apiConfig = {
      apiKey: 'apiKey',
      apiSecret: 'apiSecret',
      apiUrlRoot: 'apiUrlRoot',
    };

    afterEach(() => {
      getApiAccessToken._.unfulfilledPromises = {};
    });

    it('should return cached data', () => {
      getApiAccessToken._.unfulfilledPromises['apiKey:apiSecret'] = Promise.resolve(10);

      return getApiAccessToken(apiConfig)
        .then(res => expect(res).toBe(10));
    });

    it('should return error if request was rejected', () => {
      fetch.mockReturnValue(Promise.reject('error'));

      return getApiAccessToken(apiConfig)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('error');
        });
    });

    it('should return error if request responsed with empty body', () => {
      fetch.mockReturnValue(Promise.resolve({ json: () => Promise.resolve() }));

      return getApiAccessToken(apiConfig)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Unable to get an API access token.');
        });
    });

    it('should return error if request responsed with 403', () => {
      fetch.mockReturnValue(Promise.resolve({ status: 403, json: () => Promise.resolve({ message: 'Error while fetching token.' }) }));

      return getApiAccessToken(apiConfig)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Forbidden. Error while fetching token.');
        });
    });

    it('should return generic error if no success on request', () => {
      fetch.mockReturnValue(Promise.resolve({ status: 400, json: () => Promise.resolve({ message: 'Error' }) }));

      return getApiAccessToken(apiConfig)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Unable to get an API access token.');
        });
    });

    it('should return error if body contains error type and message', () => {
      fetch.mockReturnValue(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ errorType: 'internal', errorMessage: 'Something went wrong. Try again later.' }) }));

      return getApiAccessToken(apiConfig)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Something went wrong. Try again later.');
        });
    });

    it('should return error if body contains only error type', () => {
      fetch.mockReturnValue(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ errorType: 'internal' }) }));

      return getApiAccessToken(apiConfig)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Unable to get an API access token.');
        });
    });

    it('should return error if body contains empty token', () => {
      fetch.mockReturnValue(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ token: '' }) }));

      return getApiAccessToken(apiConfig)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Unable to get an API access token.');
        });
    });

    it('should return token', () => {
      fetch.mockReturnValue(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ token: 'token' }) }));

      return getApiAccessToken(apiConfig)
        .then(token => expect(token).toBe('token'));
    });

  });

});
