const sinon = require('sinon');
const { GraphQLClient } = require('graphql-request');

const { outbox_endpoints } = require('../../../../../src/xcoobee/api/EndPointApi');

describe('EndpointApi', () => {

  afterEach(() => sinon.restore());

  describe('outbox_endpoints', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ outbox_endpoints: ['endpoint'] }));

      return outbox_endpoints('apiUrlRoot', 'accessToken', 'userId')
        .then((res) => {
          expect(res[0]).toBe('endpoint');
          expect(stub.calledOnce).toBeTruthy();
          expect(stub.getCall(0).args[1].userCursor).toBe('userId');
        });
    });

  });

});
