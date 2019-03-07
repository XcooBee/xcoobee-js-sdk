const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');
const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('CampaignApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.getCampaignInfo', () => {

    describe('called with a valid API access token', () => {

      describe('and called with a known campaign cursor', () => {

        it('should return with expected campaign info', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = user.cursor;
          const campaigns = await CampaignApi.getCampaigns(apiUrlRoot, apiAccessToken, userCursor);
          const campaignCursor = campaigns.data[0].campaign_cursor;
          const result = await CampaignApi.getCampaignInfo(apiUrlRoot, apiAccessToken, campaignCursor);
          expect(result).toBeDefined();
          expect(result.campaign).toBeDefined();
          const { campaign } = result;
          expect(campaign).toBeDefined();
          expect(campaign.campaign_description.text).toBe(undefined);
          expect(campaign.campaign_name).toBe('Test campaign');
          expect(campaign.campaign_title.text).toBe(undefined);
          expect(campaign.date_c).toBeDefined();
          expect(campaign.date_e).toBeDefined();
          assertIso8601Like(campaign.date_c);
          expect(campaign.email_targets).toBeInstanceOf(Array);
          expect(campaign.email_targets.length).toBe(0);
          expect(campaign.endpoint).toBe(null);
          expect(campaign.status).toBe('active');
          expect(campaign.targets).toBeInstanceOf(Array);
          expect(campaign.targets.length).toBe(0);
          expect(campaign.xcoobee_targets).toBeInstanceOf(Array);
          expect(campaign.xcoobee_targets.length).toBe(0);

          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown campaign cursor', () => {

        it('should return with no data', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const campaignCursor = 'unknown';
          try {
            await CampaignApi.getCampaignInfo(apiUrlRoot, apiAccessToken, campaignCursor);
            // This should not be called.
            expect(true).toBe(false);
          } catch (err) {
            expect(err).toBeInstanceOf(XcooBeeError);
            expect(err.message).toBe('Wrong key at line: 3, column: 7');
            expect(err.name).toBe('XcooBeeError');

            done();
          }
        });// eo it

      });// eo describe

    });// eo describe

  });// eo describe('.getCampaignInfo')

  describe('.getCampaigns', () => {

    describe('called with a valid API access token', () => {

      it('should return the user\'s campaigns', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const result = await CampaignApi.getCampaigns(apiUrlRoot, apiAccessToken, userCursor);
        expect(result).toBeDefined();
        expect(result.data).toBeInstanceOf(Array);
        expect(result.page_info).toBeDefined();
        expect(result.page_info.end_cursor).toBeNull();
        expect(result.page_info.has_next_page).toBeNull();
        const campaigns = result.data;
        expect(campaigns.length).toBe(1);
        const campaign = campaigns[0];
        expect(campaign).toBeDefined();
        assertIsCursorLike(campaign.campaign_cursor);
        expect(campaign.campaign_name).toBe('Test campaign');
        expect(campaign.status).toBe('active');

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getCampaigns')

});// eo describe('CampaignApi')
