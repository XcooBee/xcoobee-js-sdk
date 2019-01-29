const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const { getCampaignInfo, getCampaigns } = require('../../../../../src/xcoobee/api/CampaignApi');

describe('CampaignApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('getCampaignInfo', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ campaign: 'campaignData' }));

      return getCampaignInfo('apiUrlRoot', 'accessToken', 'campaignId')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.campaign).toBe('campaignData');

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].campaignId).toBe('campaignId');
        });
    });

  });

  describe('getCampaigns', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ campaigns: [{ title: 'test' }] }));

      return getCampaigns('apiUrlRoot', 'accessToken', 'userId')
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(res[0].title).toBe('test');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].userCursor).toBe('userId');
        });
    });

  });

});
