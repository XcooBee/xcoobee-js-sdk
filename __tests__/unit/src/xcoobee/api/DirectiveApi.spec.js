const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const { addDirective } = require('../../../../../src/xcoobee/api/DirectiveApi');

describe('DirectiveApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('addDirective', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ add_directive: { ref_id: 'refId' } }));

      return addDirective('apiUrlRoot', 'accessToken', 'directiveInput')
        .then((res) => {
          expect(res).toBe('refId');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].directiveInput).toBe('directiveInput');
        });
    });

  });

});
