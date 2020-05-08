const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');
const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');

const Config = require('../../../../../src/xcoobee/sdk/Config');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');
const System = require('../../../../../src/xcoobee/sdk/System');

const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('System', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  const getCampaign = async () => {
    const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
    const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
    const userCursor = user.cursor;
    const campaigns = await CampaignApi.getCampaigns(apiUrlRoot, apiAccessToken, userCursor);
    return campaigns.data[0];
  };
  describe('instance', () => {

    describe('.listEventSubscriptions', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('and known campaign ID', () => {

          describe('using default config', () => {

            it('should fetch and return with the event subscriptions for the campaign', async (done) => {
              const campaign = await getCampaign();
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: campaign.campaign_cursor,
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.listEventSubscriptions();
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              const eventSubscriptions = result.data;
              expect(eventSubscriptions).toBeInstanceOf(Array);
              expect(eventSubscriptions.length).toBe(2);
              const eventSubscription = eventSubscriptions[0];
              expect(eventSubscription.reference_cursor).toBe(campaign.campaign_cursor);
              assertIso8601Like(eventSubscription.date_c);
              assertIsCursorLike(eventSubscription.owner_cursor);
              expect(eventSubscription.topic).toBe(`campaign:${campaign.campaign_reference}/data_approved`);
              expect(eventSubscription.channel).toBe('email');

              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

    });// eo describe('.listEventSubscriptions')

    describe('.addEventSubscriptions', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('and a known campaign ID', () => {

          describe('and a valid events mapping', () => {

            describe('using default config', () => {

              it('should add the event subscriptions for the campaign', async (done) => {
                const campaign = await getCampaign();

                const defaultConfig = new Config({
                  apiKey,
                  apiSecret,
                  apiUrlRoot,
                  campaignId: campaign.campaign_cursor,
                });

                const eventSubscriptions = [
                  {
                    topic: `campaign:${campaign.campaign_reference}/*`,
                    channel: 'webhook',
                    handler: 'testHandler',
                  },
                ];

                const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
                const response = await systemSdk.addEventSubscriptions(eventSubscriptions);
                expect(response).toBeInstanceOf(SuccessResponse);
                const { result } = response;
                expect(result).toBeDefined();

                const eventSubscriptionsPage = result;
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

            });// eo describe

          });// eo describe

        });// eo describe

      });// eo describe

    });// eo describe('.addEventSubscriptions')

    describe('.deleteEventSubscriptions', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('and a known campaign ID', () => {

          describe('and a valid events mapping', () => {

            describe('using default config', () => {

              it('should delete both of the event subscriptions', async (done) => {
                const campaign = await getCampaign();

                const defaultConfig = new Config({
                  apiKey,
                  apiSecret,
                  apiUrlRoot,
                  campaignId: campaign.campaign_cursor,
                });

                const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
                const response = await systemSdk.deleteEventSubscriptions([{ topic: `campaign:${campaign.campaign_reference}/*`, channel: 'webhook' }]);
                expect(response).toBeInstanceOf(SuccessResponse);
                const { deleted_number } = response.result;
                expect(deleted_number).toBe(1);

                done();
              });// eo it

            });// eo describe

          });// eo describe

        });// eo describe

      });// eo describe

    });// eo describe('.deleteEventSubscriptions')

    describe('.getEvents', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with the user\'s events', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.getEvents();
            expect(response).toBeInstanceOf(PagingResponse);
            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBe(null);
            expect(result.page_info.has_next_page).toBe(null);
            const events = result.data;
            expect(events).toBeInstanceOf(Array);
            expect(events.length).toBe(0);

            done();
          });// eo it

        });// eo describe

        describe('using overriding config', () => {

          it('should fetch and return with the user\'s events', async (done) => {
            const defaultConfig = new Config({
              apiKey: 'should_be_unused',
              apiSecret: 'should_be_unused',
              apiUrlRoot: 'should_be_unused',
            });
            const overridingConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.getEvents(overridingConfig);
            expect(response).toBeInstanceOf(PagingResponse);
            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBe(null);
            expect(result.page_info.has_next_page).toBe(null);
            const events = result.data;
            expect(events).toBeInstanceOf(Array);
            expect(events.length).toBe(0);

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.getEvents')

    describe('.getAvailableSubscriptions', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with the user\'s events', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const campaign = await getCampaign();

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const { result } = await systemSdk.getAvailableSubscriptions(campaign.campaign_cursor, 'campaign');
            expect(result).toBeDefined();
            expect(result[0].topic).toBe(`campaign:${campaign.campaign_reference}/*`);
            expect(result[0].channels[0]).toBe('email');
            expect(result[0].channels[1]).toBe('webhook');
            expect(result[0].channels[2]).toBe('inbox');

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.getAvailableSubscriptions'campaign.campaign_cursor, 'campaign')

  });// eo describe('instance')

});// eo describe('System')
