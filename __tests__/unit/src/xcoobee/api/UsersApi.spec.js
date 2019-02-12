const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const { getUser, getUserPublicKey } = require('../../../../../src/xcoobee/api/UsersApi');

describe('UsersApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('getUser', () => {

    it('should return user from cache', () => {
      getUser._.unfulfilledPromises.userAccessToken = Promise.resolve({ firstname: 'test' });

      return getUser('apiUrlRoot', 'userAccessToken')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.firstname).toBe('test');
        });
    });

    it('should call graphql endpoint with params', () => {
      getUser._.unfulfilledPromises = {};
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ user: { firstname: 'test' } }));

      return getUser('apiUrlRoot', 'userAccessToken')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.firstname).toBe('test');
        });
    });

  });

  describe('getUserPublicKey', () => {

    it('should return user\'s public key', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ users: { data: [{ pgp_public_key: 'test' }] } }));

      return getUserPublicKey('apiUrlRoot', 'userAccessToken', '~xcoobeeId')
        .then((res) => {
          expect(res).toBe('test');

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.xid).toBe('~xcoobeeId');
        });
    });

    it('should return null', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ users: { data: [] } }));

      return getUserPublicKey('apiUrlRoot', 'userAccessToken', '~xcoobeeId')
        .then(res => expect(res).toBeNull());
    });

  });

});
