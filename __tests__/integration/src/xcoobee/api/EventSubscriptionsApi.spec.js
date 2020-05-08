const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const EventSubscriptionsApi = require('../../../../../src/xcoobee/api/EventSubscriptionsApi');

const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventSubscriptionsApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  const getCampaign = async () => {
    const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
    const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
    const userCursor = user.cursor;
    const campaigns = await CampaignApi.getCampaigns(apiUrlRoot, apiAccessToken, userCursor);
    return campaigns.data[0];
  };

  describe('.listEventSubscriptions', () => {

    describe('called with a valid API access token', () => {

      describe('and called with a known campaign ID', () => {

        it('should return with a list of event subscriptions', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const campaign = await getCampaign();
          const eventSubscriptionsPage = await EventSubscriptionsApi.listEventSubscriptions(
            apiUrlRoot, apiAccessToken, campaign.campaign_cursor, 'campaign'
          );
          expect(eventSubscriptionsPage).toBeDefined();
          const eventSubscription = eventSubscriptionsPage.data[0];
          expect(eventSubscription.reference_cursor).toBe(campaign.campaign_cursor);
          assertIso8601Like(eventSubscription.date_c);
          assertIsCursorLike(eventSubscription.owner_cursor);
          expect(eventSubscription.topic).toBe(`campaign:${campaign.campaign_reference}/data_approved`);
          expect(eventSubscription.channel).toBe('email');

          done();
        });// eo it

      });// eo describe

    });// eo describe

  });// eo describe('.listEventSubscriptions')

  describe('.addEventSubscriptions', () => {

    describe('called with a valid API access token', () => {

      describe('and a known campaign ID', () => {

        describe('and a valid events mapping', () => {

          it('should add the event subscriptions', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);

            const campaign = await getCampaign();

            const eventSubscriptions = [
              {
                topic: `campaign:${campaign.campaign_reference}/*`,
                channel: 'webhook',
                handler: 'testHandler',
              },
            ];

            const eventSubscriptionsPage = await EventSubscriptionsApi.addEventSubscriptions(
              apiUrlRoot, apiAccessToken, eventSubscriptions
            );
            expect(eventSubscriptionsPage).toBeDefined();
            expect(eventSubscriptionsPage.data).toBeInstanceOf(Array);
            expect(eventSubscriptionsPage.data.length).toBe(1);

            const eventSubscription = eventSubscriptionsPage.data[0];
            expect(eventSubscription.reference_cursor).toBe(campaign.campaign_cursor);
            assertIsCursorLike(eventSubscription.owner_cursor);
            expect(eventSubscription.topic).toBe(`campaign:${campaign.campaign_reference}/*`);
            expect(eventSubscription.channel).toBe('webhook');
            expect(eventSubscription.handler).toBe('testHandler');

            done();
          });// eo it

          it('should throw an error when trying to add an existing event subscription type', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const campaign = await getCampaign();

            const topic = `campaign:${campaign.campaign_reference}/*`;
            const channel = 'webhook';
            const eventSubscriptions = [
              {
                topic,
                channel,
                handler: 'testHandler',
              },
            ];
            try {
              await EventSubscriptionsApi.addEventSubscriptions(
                apiUrlRoot, apiAccessToken, eventSubscriptions
              );
              // This should not be called.
              expect(true).toBe(false);
            } catch (err) {
              expect(err).toBeInstanceOf(XcooBeeError);
              expect(err.message).toBe(`Event subscriptions for '${topic}' and channel '${channel}' already exist. Remove them first. at line: 3, column: 7`);
              expect(err.name).toBe('XcooBeeError');

              done();
            }
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe

  });// eo describe('.addEventSubscriptions')

  describe('.deleteEventSubscriptions', () => {

    describe('called with a valid API access token', () => {

      describe('and a known campaign ID', () => {

        describe('and a valid events mapping', () => {

          it('should delete event subscription', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);

            const campaign = await getCampaign();

            const result = await EventSubscriptionsApi.deleteEventSubscriptions(
              apiUrlRoot, apiAccessToken, [{ topic: `campaign:${campaign.campaign_reference}/*`, channel: 'webhook' }]
            );
            expect(result).toBeDefined();
            expect(result.deleted_number).toBe(1);

            done();
          });// eo it
        });// eo describe

      });// eo describe

    });// eo describe

  });// eo describe('.deleteEventSubscriptions')

  describe('.getAvailableSubscriptions', () => {

    describe('called with a valid API access token', () => {

      describe('and a known campaign ID', () => {

        describe('and a valid events mapping', () => {

          it('should delete event subscription', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);

            const campaign = await getCampaign();

            const result = await EventSubscriptionsApi.getAvailableSubscriptions(
              apiUrlRoot, apiAccessToken, campaign.campaign_cursor, 'campaign'
            );
            expect(result).toBeDefined();
            expect(result[0].topic).toBe(`campaign:${campaign.campaign_reference}/*`);
            expect(result[0].channels[0]).toBe('email');
            expect(result[0].channels[1]).toBe('webhook');
            expect(result[0].channels[2]).toBe('inbox');

            done();
          });// eo it
        });// eo describe

      });// eo describe

    });// eo describe

  });// eo describe('.getAvailableSubscriptions')

});// eo describe('EventSubscriptionsApi')
