import CampaignApi from '../../../../../src/xcoobee/api/CampaignApi';
import TokenApi from '../../../../../src/xcoobee/api/TokenApi';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('CampaignApi', function () {

  describe('.getCampaignInfo', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known campaign ID', function () {

        it('should return with no data', function (done) {
          TokenApi.getApiAccessToken({
            apiKey,
            apiSecret,
          })
            .then((apiAccessToken) => {
              const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
              CampaignApi.getCampaignInfo(apiAccessToken, campaignId)
                .then((campaignInfo) => {
                  console.dir(campaignInfo);
                  expect(campaignInfo).toBeDefined();
                  // TODO: Add more expectations.
                  done();
                })
            });
        });

      });

      describe('and called with an unknown campaign ID', function () {

        it('should return with no data', function (done) {
          TokenApi.getApiAccessToken({
            apiKey,
            apiSecret,
          })
            .then((apiAccessToken) => {
              const campaignId = 'unknown';
              CampaignApi.getCampaignInfo(apiAccessToken, campaignId)
                .then((campaignInfo) => {
                  console.dir(campaignInfo);
                  expect(campaignInfo).toBeDefined();
                  // TODO: Add more expectations.
                  done();
                })
            });
        });

      });

    });

  });

});
