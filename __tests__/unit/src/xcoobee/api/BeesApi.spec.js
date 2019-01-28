const sinon = require('sinon');
const { GraphQLClient } = require('graphql-request');

const { bees } = require('../../../../../src/xcoobee/api/BeesApi');

describe('BeesApi', () => {

  afterEach(() => sinon.restore());

  describe('bees', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ bees: [] }));

      return bees('apiUrlRoot', 'accessToken', 'bee')
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(stub.calledOnce).toBeTruthy();
          const options = stub.getCall(0).args[1];

          expect(options.after).toBeNull();
          expect(options.first).toBeNull();
          expect(options.searchText).toBe('bee');
        });
    });

  });

});
