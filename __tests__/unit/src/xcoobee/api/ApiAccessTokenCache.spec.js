const jest = require('jest');

jest.mock('jwt-decode');
jest.mock('../../../../../src/xcoobee/api/TokenApi');

const jwtDecode = require('jwt-decode');

const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const TokenApi = require('../../../../../src/xcoobee/api/TokenApi');

describe('ApiAccessTokenCache', () => {

  describe('get', () => {

    describe('Validation', () => {
      const ApiAccessTokenCacheInstance = new ApiAccessTokenCache();

      it('should return TypeError if `apiUrlRoot` not provided', () => {
        try {
          ApiAccessTokenCacheInstance.get();
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('apiUrlRoot is required.');
        }
      });

      it('should return TypeError if `apiKey` not provided', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot');
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('apiKey is required.');
        }
      });

      it('should return TypeError if `apiSecret` not provided', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey');
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('apiSecret is required.');
        }
      });

      it('should return TypeError if `apiUrlRoot` is not string', () => {
        try {
          ApiAccessTokenCacheInstance.get(true, 'apiKey', 'apiSecret');
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('apiUrlRoot must be a string.');
        }
      });

      it('should return TypeError if `apiKey` is not string', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot', true, 'apiSecret');
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('apiKey must be a string.');
        }
      });

      it('should return TypeError if `apiSecret` is not string', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', true);
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('apiSecret must be a string.');
        }
      });
    });

    describe('Token', () => {
      let ApiAccessTokenCacheInstance;
      let now;

      beforeEach(() => {
        ApiAccessTokenCacheInstance = new ApiAccessTokenCache();
        now = Date.now.bind(global.Date);
      });

      afterEach(() => {
        global.Date.now = now;
      });

      it('should validate and return token from cache', () => {
        jwtDecode.mockReturnValue({ exp: 1547078400 }); // 2019-01-10

        ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret'] = 'cachedAccessToken';

        const dateNowStub = () => 1546300800000;
        global.Date.now = dateNowStub; // 2019-01-01

        return ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
          .then(token => expect(token).toBe('cachedAccessToken'));
      });

      it('should validate and return fresh token', () => {
        jwtDecode.mockReturnValue({ exp: 1546300800 }); // 2019-01-01

        ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret'] = 'cachedAccessToken';

        const dateNowStub = () => 1546387200000;
        global.Date.now = dateNowStub; // 2019-01-02

        TokenApi.getApiAccessToken.mockReturnValue(Promise.resolve('accessToken'));

        return ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
          .then((token) => {
            expect(token).toBe('accessToken');
            expect(ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret']).toBe('accessToken');
          });

      });

      it('should get fresh token', () => {
        TokenApi.getApiAccessToken.mockReturnValue(Promise.resolve('accessToken'));

        return ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret', true)
          .then((token) => {
            expect(token).toBe('accessToken');
            expect(ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret']).toBe('accessToken');
          });
      });
    });

  });

});
