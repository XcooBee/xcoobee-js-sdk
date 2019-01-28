const sinon = require('sinon');
const jest = require('jest');

jest.mock('jwt-decode');

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
        } catch (e) {
          expect(e).toBeInstanceOf(TypeError);
          expect(e.message).toBe('apiUrlRoot is required.');
        }
      });

      it('should return TypeError if `apiKey` not provided', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot');
        } catch (e) {
          expect(e).toBeInstanceOf(TypeError);
          expect(e.message).toBe('apiKey is required.');
        }
      });

      it('should return TypeError if `apiSecret` not provided', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey');
        } catch (e) {
          expect(e).toBeInstanceOf(TypeError);
          expect(e.message).toBe('apiSecret is required.');
        }
      });

      it('should return TypeError if `apiUrlRoot` is not string', () => {
        try {
          ApiAccessTokenCacheInstance.get(true, 'apiKey', 'apiSecret');
        } catch (e) {
          expect(e).toBeInstanceOf(TypeError);
          expect(e.message).toBe('apiUrlRoot must be a string.');
        }
      });

      it('should return TypeError if `apiKey` is not string', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot', true, 'apiSecret');
        } catch (e) {
          expect(e).toBeInstanceOf(TypeError);
          expect(e.message).toBe('apiKey must be a string.');
        }
      });

      it('should return TypeError if `apiSecret` is not string', () => {
        try {
          ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', true);
        } catch (e) {
          expect(e).toBeInstanceOf(TypeError);
          expect(e.message).toBe('apiSecret must be a string.');
        }
      });
    });

    describe('Token', () => {
      let ApiAccessTokenCacheInstance;

      beforeEach(() => {
        ApiAccessTokenCacheInstance = new ApiAccessTokenCache();
      });

      it('should validate and return token from cache', () => {
        jwtDecode.mockReturnValue({ exp: 1547078400 }); // 2019-01-10

        ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret'] = 'cachedAccessToken';

        const now = new Date('2019-01-01');
        const timerStub = sinon.useFakeTimers(now.getTime());

        return ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
          .then((token) => {
            expect(token).toBe('cachedAccessToken');

            sinon.restore();
            timerStub.restore();
          });

      });

      it('should validate and return fresh token', () => {
        jwtDecode.mockReturnValue({ exp: 1546300800 }); // 2019-01-00

        ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret'] = 'cachedAccessToken';

        const now = new Date('2019-01-02');
        const timerStub = sinon.useFakeTimers(now.getTime());

        sinon.stub(TokenApi, 'getApiAccessToken').returns(Promise.resolve('accessToken'));

        return ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
          .then((token) => {
            expect(token).toBe('accessToken');
            expect(ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret']).toBe('accessToken');

            sinon.restore();
            timerStub.restore();
          });

      });

      it('should get fresh token', () => {
        sinon.stub(TokenApi, 'getApiAccessToken').returns(Promise.resolve('accessToken'));

        return ApiAccessTokenCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret', true)
          .then((token) => {
            expect(token).toBe('accessToken');
            expect(ApiAccessTokenCacheInstance._.internalCache['apiUrlRoot:apiKey:apiSecret']).toBe('accessToken');

            sinon.restore();
          });
      });
    });

  });

});
