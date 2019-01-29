const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const { bees } = require('../../../../../src/xcoobee/api/BeesApi');

describe('BeesApi', () => {

  describe('bees', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ bees: [] }));

      return bees('apiUrlRoot', 'accessToken', 'bee')
        .then((res) => {
          expect(res).toBeInstanceOf(Array);

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];

          expect(options.after).toBeNull();
          expect(options.first).toBeNull();
          expect(options.searchText).toBe('bee');
        });
    });

  });

});
