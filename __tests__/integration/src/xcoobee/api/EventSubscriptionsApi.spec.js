import EventSubscriptionsApi from '../../../../../src/xcoobee/api/EventSubscriptionsApi';
import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';
import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventSubscriptionsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.listEventSubscriptions', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known campaign ID', function () {

        it('should return with a list of event subscriptions', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiKey, apiSecret);
          const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
          const eventSubscriptions = await EventSubscriptionsApi.listEventSubscriptions(apiAccessToken, campaignId);
          expect(eventSubscriptions).toBeInstanceOf(Array);
          expect(eventSubscriptions.length).toBe(0);
          // const eventSubscription = eventSubscriptions[0];
          // expect(eventSubscription.date_c).toBe('');
          // expect(eventSubscription.handler).toBe('');
          // expect(eventSubscription.event_type).toBe('');
          // TODO: Add more expectations.
          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown campaign ID', async function () {

        it('should return with no data', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiKey, apiSecret);
          const campaignId = 'unknown';
          try {
            await EventSubscriptionsApi.listEventSubscriptions(apiAccessToken, campaignId);
            // This should not be called.
            expect(true).toBe(false);
          } catch (err) {
            expect(err).toBeInstanceOf(XcooBeeError);
            expect(err.message).toBe('Wrong key at line: 3, column: 7');
            expect(err.name).toBe('XcooBeeError');
            done();
          }
        });

      });// eo describe

    });// eo describe

  });// eo describe('.listEventSubscriptions')

});// eo describe('EventSubscriptionsApi')
