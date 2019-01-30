const jest = require('jest');

jest.mock('../../../../../src/xcoobee/api/ApiAccessTokenCache');
jest.mock('../../../../../src/xcoobee/api/UsersApi');

const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const UsersApi = require('../../../../../src/xcoobee/api/UsersApi');

const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

describe('UsersCache', () => {

  afterEach(() => {
    ApiAccessTokenCache.prototype.get.mockReset();
    UsersApi.getUser.mockReset();
  });

  describe('get', () => {

    it('should return user if it\'s in cache already', () => {
      const apiAccessTokenCacheInstance = new ApiAccessTokenCache();
      const usersCacheInstance = new UsersCache(apiAccessTokenCacheInstance);

      usersCacheInstance._.internalCache['apiKey:apiSecret'] = { xcoobee_id: '~user' };

      return usersCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.xcoobee_id).toBe('~user');
        });
    });

    it('should return user from api and save to cache', () => {
      const apiAccessTokenCacheInstance = new ApiAccessTokenCache();

      apiAccessTokenCacheInstance.get.mockReturnValue(Promise.resolve('apiAccessToken'));
      UsersApi.getUser.mockReturnValue(Promise.resolve({ xcoobee_id: '~user' }));

      const usersCacheInstance = new UsersCache(apiAccessTokenCacheInstance);

      return usersCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.xcoobee_id).toBe('~user');

          expect(UsersApi.getUser).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken');

          expect(usersCacheInstance._.internalCache['apiKey:apiSecret'].xcoobee_id).toBe('~user');
        });
    });

    it('should try to refresh token and then get user again', () => {
      const apiAccessTokenCacheInstance = new ApiAccessTokenCache();

      apiAccessTokenCacheInstance.get.mockReturnValue(Promise.resolve('apiAccessToken'));

      UsersApi.getUser
        .mockReturnValueOnce(Promise.resolve(Promise.reject({ code: 403 })))
        .mockReturnValueOnce(Promise.resolve(Promise.resolve({ xcoobee_id: '~user' })));

      const usersCacheInstance = new UsersCache(apiAccessTokenCacheInstance);

      return usersCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.xcoobee_id).toBe('~user');

          expect(UsersApi.getUser).toHaveBeenCalledTimes(2);
          expect(UsersApi.getUser).toHaveNthReturnedWith(1, Promise.reject({ code: 403 }));
          expect(UsersApi.getUser).toHaveNthReturnedWith(2, Promise.resolve({ xcoobee_id: '~user' }));

          expect(usersCacheInstance._.internalCache['apiKey:apiSecret'].xcoobee_id).toBe('~user');
        });
    });

  });

});
