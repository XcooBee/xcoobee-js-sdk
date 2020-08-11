jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const {
  getCampaignInfo,
  getCampaigns,
  getCampaignIdByRef,
  validateCampaignExists,
} = require('../../../../../src/xcoobee/api/CampaignApi');

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

  describe('getCampaignIdByRef', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ campaign: { campaign_cursor: 'campaignId' } }));

      return getCampaignIdByRef('apiUrlRoot', 'accessToken', 'campaignRef')
        .then((res) => {
          expect(res).toBe('campaignId');

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].campaignRef).toBe('campaignRef');
        });
    });

    it('should return empty string if campaign not found', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.reject());

      return getCampaignIdByRef('apiUrlRoot', 'accessToken', 'campaignRef')
        .then((res) => {
          expect(res).toBe('');

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].campaignRef).toBe('campaignRef');
        });
    });

  });

  describe('validateCampaignExists', () => {

    it('should return true if campaign exists', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ campaign: 'campaignData' }));

      return validateCampaignExists('apiUrlRoot', 'accessToken', 'campaignId')
        .then((res) => {
          expect(res).toBe(true);
        });
    });

    it('should throw error if campaign doesn`t exist', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ campaign: undefined }));

      return validateCampaignExists('apiUrlRoot', 'accessToken', 'campaignId')
        .then(() => expect(true).toBe(false))
        .catch((err) => expect(err.message).toBe('Campaign not found'));
    });

  });

});
