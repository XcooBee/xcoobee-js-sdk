const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const { outbox_endpoints } = require('../../../../../src/xcoobee/api/EndPointApi');

describe('EndpointApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('outbox_endpoints', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ outbox_endpoints: ['endpoint'] }));

      return outbox_endpoints('apiUrlRoot', 'accessToken', 'userId')
        .then((res) => {
          expect(res[0]).toBe('endpoint');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].userCursor).toBe('userId');
        });
    });

  });

});
