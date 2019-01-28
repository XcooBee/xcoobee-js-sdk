const sinon = require('sinon');
const { GraphQLClient } = require('graphql-request');

const { getCampaignInfo, getCampaigns } = require('../../../../../src/xcoobee/api/CampaignApi');

describe('CampaignApi', () => {

  afterEach(() => sinon.restore());

  describe('getCampaignInfo', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ campaign: 'campaignData' }));

      return getCampaignInfo('apiUrlRoot', 'accessToken', 'campaignId')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.campaign).toBe('campaignData');
          expect(stub.calledOnce).toBeTruthy();
          expect(stub.getCall(0).args[1].campaignId).toBe('campaignId');
        });
    });

  });

  describe('getCampaigns', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ campaigns: [{ title: 'test' }] }));

      return getCampaigns('apiUrlRoot', 'accessToken', 'userId')
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(res[0].title).toBe('test');
          expect(stub.calledOnce).toBeTruthy();
          expect(stub.getCall(0).args[1].userCursor).toBe('userId');
        });
    });

  });

});
