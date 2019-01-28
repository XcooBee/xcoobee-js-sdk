const sinon = require('sinon');
const { GraphQLClient } = require('graphql-request');

const { addDirective } = require('../../../../../src/xcoobee/api/DirectiveApi');

describe('DirectiveApi', () => {

  afterEach(() => sinon.restore());

  describe('addDirective', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ add_directive: { ref_id: 'refId' } }));

      return addDirective('apiUrlRoot', 'accessToken', 'directiveInput')
        .then((res) => {
          expect(res).toBe('refId');
          expect(stub.calledOnce).toBeTruthy();
          expect(stub.getCall(0).args[1].directiveInput).toBe('directiveInput');
        });
    });

  });

});
