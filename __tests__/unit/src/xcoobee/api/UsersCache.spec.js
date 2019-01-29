const sinon = require('sinon');

const UsersApi = require('../../../../../src/xcoobee/api/UsersApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');
const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');

describe('UsersCache', () => {

  afterEach(() => sinon.restore());

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

      sinon.stub(apiAccessTokenCacheInstance, 'get').returns(Promise.resolve('apiAccessToken'));

      const getUserStub = sinon.stub(UsersApi, 'getUser').returns(Promise.resolve({ xcoobee_id: '~user' }));

      const usersCacheInstance = new UsersCache(apiAccessTokenCacheInstance);

      return usersCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.xcoobee_id).toBe('~user');

          expect(getUserStub.calledWithExactly('apiUrlRoot', 'apiAccessToken')).toBeTruthy();

          expect(usersCacheInstance._.internalCache['apiKey:apiSecret'].xcoobee_id).toBe('~user');
        });
    });

    it('should try to refresh token and then get user again', () => {
      const apiAccessTokenCacheInstance = new ApiAccessTokenCache();

      sinon.stub(apiAccessTokenCacheInstance, 'get').returns(Promise.resolve('apiAccessToken'));

      const getUserStub = sinon.stub(UsersApi, 'getUser');
      getUserStub.onFirstCall().returns(Promise.reject({ code: 403 }));
      getUserStub.onSecondCall().returns(Promise.resolve({ xcoobee_id: '~user' }));

      const usersCacheInstance = new UsersCache(apiAccessTokenCacheInstance);

      return usersCacheInstance.get('apiUrlRoot', 'apiKey', 'apiSecret')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.xcoobee_id).toBe('~user');

          expect(getUserStub.calledTwice).toBeTruthy();

          expect(usersCacheInstance._.internalCache['apiKey:apiSecret'].xcoobee_id).toBe('~user');
        });
    });

  });

});
