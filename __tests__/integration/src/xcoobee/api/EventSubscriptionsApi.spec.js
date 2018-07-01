import EventSubscriptionsApi from '../../../../../src/xcoobee/api/EventSubscriptionsApi';
import TokenApi from '../../../../../src/xcoobee/api/TokenApi';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventSubscriptionsApi', function () {

  describe('.listEventSubscriptions', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known campaign ID', function () {

        it('should return with a list of event subscriptions', function (done) {
          TokenApi.getApiAccessToken({
            apiKey,
            apiSecret,
          })
            .then((apiAccessToken) => {
              const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
              EventSubscriptionsApi.listEventSubscriptions(apiAccessToken, campaignId)
                .then((res) => {
                  console.dir(res);
                  expect(res).toBeDefined();
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
              EventSubscriptionsApi.listEventSubscriptions(apiAccessToken, campaignId)
                .then((res) => {
                  console.dir(res);
                  expect(res).toBeDefined();
                  // TODO: Add more expectations.
                  done();
                })
            });
        });

      });

    });

  });

});
