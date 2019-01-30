const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const { getUser } = require('../../../../../src/xcoobee/api/UsersApi');

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

});
