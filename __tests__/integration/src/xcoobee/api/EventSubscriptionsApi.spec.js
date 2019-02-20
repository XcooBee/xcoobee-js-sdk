const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const EventSubscriptionsApi = require('../../../../../src/xcoobee/api/EventSubscriptionsApi');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const { addTestEventSubscriptions, deleteAllEventSubscriptions } = require('../../../../lib/EventSubscriptionUtils');
const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventSubscriptionsApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  beforeAll(async (done) => {
    const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
    await deleteAllEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

    done();
  });

  describe('.addEventSubscription', () => {

    describe('called with a valid API access token', () => {

      describe('and a known campaign ID', () => {

        describe('and a valid events mapping', () => {

          afterEach(async (done) => {
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            await deleteAllEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

            done();
          });

          it('should add the event subscriptions', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const eventsMapping = {
              ConsentApproved: 'OnConsentApproved',
              DataDeclined: 'OnDataDeclined',
            };
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            const eventSubscriptionsPage = await EventSubscriptionsApi.addEventSubscription(
              apiUrlRoot, apiAccessToken, eventsMapping, campaignId
            );
            expect(eventSubscriptionsPage).toBeDefined();
            expect(eventSubscriptionsPage.data).toBeInstanceOf(Array);
            expect(eventSubscriptionsPage.data.length).toBe(2);
            let eventSubscription = eventSubscriptionsPage.data[0];
            expect(eventSubscription.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
            // assertIso8601Like(eventSubscription.date_c);
            expect(eventSubscription.date_c).toBe(null);
            if (eventSubscription.event_type === 'consent_approved') {
              expect(eventSubscription.handler).toBe('OnConsentApproved');
            } else if (eventSubscription.event_type === 'data_declined') {
              expect(eventSubscription.handler).toBe('OnDataDeclined');
            } else {
              // This should not be called.
              expect(true).toBe(false);
            }
            assertIsCursorLike(eventSubscription.owner_cursor);
            expect(eventSubscriptionsPage.page_info).toBe(null);

            eventSubscription = eventSubscriptionsPage.data[1];
            expect(eventSubscription.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
            // assertIso8601Like(eventSubscription.date_c);
            expect(eventSubscription.date_c).toBe(null);
            if (eventSubscription.event_type === 'consent_approved') {
              expect(eventSubscription.handler).toBe('OnConsentApproved');
            } else if (eventSubscription.event_type === 'data_declined') {
              expect(eventSubscription.handler).toBe('OnDataDeclined');
            } else {
              // This should not be called.
              expect(true).toBe(false);
            }
            assertIsCursorLike(eventSubscription.owner_cursor);
            expect(eventSubscriptionsPage.page_info).toBe(null);

            done();
          });// eo it

          it('should throw an error when trying to add an existing event subscription type', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const eventsMapping = {
              ConsentApproved: 'OnConsentApproved',
            };
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            await EventSubscriptionsApi.addEventSubscription(
              apiUrlRoot, apiAccessToken, eventsMapping, campaignId
            );
            try {
              await EventSubscriptionsApi.addEventSubscription(
                apiUrlRoot, apiAccessToken, eventsMapping, campaignId
              );
              // This should not be called.
              expect(true).toBe(false);
            } catch (err) {
              expect(err).toBeInstanceOf(XcooBeeError);
              expect(err.message).toBe('Event subscription for consent_approved already exists at line: 3, column: 7');
              expect(err.name).toBe('XcooBeeError');

              done();
            }
          });// eo it

        });// eo describe

        describe('and an invalid events mapping', () => {

          it('should throw an error', async (done) => {
            const apiAccessToken = 'should_not_matter_expecting_to_fail_fast';
            const eventsMapping = {
              Invalid: 'invalid',
            };
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            try {
              await EventSubscriptionsApi.addEventSubscription(
                apiUrlRoot, apiAccessToken, eventsMapping, campaignId
              );
              // This should not be called.
              expect(true).toBe(false);
            } catch (err) {
              expect(err).toBeInstanceOf(XcooBeeError);
              expect(err.message).toBe('Invalid event type provided: "Invalid".');
              expect(err.name).toBe('XcooBeeError');

              done();
            }
          });// eo it

        });// eo describe

      });// eo describe

      describe('and an unknown campaign ID', async () => {

        it('should throw an error', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const eventsMapping = {
            ConsentApproved: 'OnConsentApproved',
          };
          const campaignId = 'unknown';
          try {
            await EventSubscriptionsApi.addEventSubscription(apiUrlRoot, apiAccessToken, eventsMapping, campaignId);
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

  });// eo describe('.addEventSubscription')

  describe('.deleteEventSubscription', () => {

    describe('called with a valid API access token', () => {

      describe('and a known campaign ID', () => {

        describe('and a valid events mapping', () => {

          beforeEach(async (done) => {
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            await addTestEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

            done();
          });

          it('should delete both of the event subscriptions', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const eventTypes = ['ConsentApproved', 'DataDeclined'];
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            const result = await EventSubscriptionsApi.deleteEventSubscription(
              apiUrlRoot, apiAccessToken, eventTypes, campaignId
            );
            expect(result).toBeDefined();
            expect(result.deleted_number).toBe(2);

            done();
          });// eo it

          it('should delete each of the event subscriptions', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            let eventTypes = ['ConsentApproved'];
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            let result = await EventSubscriptionsApi.deleteEventSubscription(
              apiUrlRoot, apiAccessToken, eventTypes, campaignId
            );
            expect(result).toBeDefined();
            expect(result.deleted_number).toBe(1);

            eventTypes = ['DataDeclined'];
            result = await EventSubscriptionsApi.deleteEventSubscription(
              apiUrlRoot, apiAccessToken, eventTypes, campaignId
            );
            expect(result).toBeDefined();
            expect(result.deleted_number).toBe(1);

            done();
          });// eo it
        });// eo describe

        describe('and an invalid events mapping', () => {

          it('should throw an error', async (done) => {
            const apiAccessToken = 'should_not_matter_expecting_to_fail_fast';
            const eventTypes = ['Invalid'];
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            try {
              await EventSubscriptionsApi.deleteEventSubscription(
                apiUrlRoot, apiAccessToken, eventTypes, campaignId
              );
              // This should not be called.
              expect(true).toBe(false);
            } catch (err) {
              expect(err).toBeInstanceOf(XcooBeeError);
              expect(err.message).toBe('Invalid event type provided: "Invalid".');
              expect(err.name).toBe('XcooBeeError');

              done();
            }
          });// eo it

        });// eo describe

      });// eo describe

      describe('and an unknown campaign ID', async () => {

        it('should throw an error', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const eventTypes = ['ConsentApproved'];
          const campaignId = 'unknown';
          try {
            await EventSubscriptionsApi.deleteEventSubscription(apiUrlRoot, apiAccessToken, eventTypes, campaignId);
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

  });// eo describe('.deleteEventSubscription')

  describe('.listEventSubscriptions', () => {

    describe('called with a valid API access token', () => {

      describe('and called with a known campaign ID', () => {

        beforeEach(async (done) => {
          const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
          await addTestEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

          done();
        });

        afterEach(async (done) => {
          const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
          await deleteAllEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

          done();
        });

        it('should return with a list of event subscriptions', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
          const eventSubscriptionsPage = await EventSubscriptionsApi.listEventSubscriptions(
            apiUrlRoot, apiAccessToken, campaignId
          );
          expect(eventSubscriptionsPage).toBeDefined();
          expect(eventSubscriptionsPage.page_info).toBeDefined();
          expect(eventSubscriptionsPage.data).toBeInstanceOf(Array);
          expect(eventSubscriptionsPage.data.length).toBe(2);
          let eventSubscription = eventSubscriptionsPage.data[0];
          expect(eventSubscription.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
          assertIso8601Like(eventSubscription.date_c);
          if (eventSubscription.event_type === 'consent_approved') {
            expect(eventSubscription.handler).toBe('OnConsentApproved');
          } else if (eventSubscription.event_type === 'data_declined') {
            expect(eventSubscription.handler).toBe('OnDataDeclined');
          } else {
            // This should not be called.
            expect(true).toBe(false);
          }
          assertIsCursorLike(eventSubscription.owner_cursor);

          eventSubscription = eventSubscriptionsPage.data[1];
          expect(eventSubscription.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
          assertIso8601Like(eventSubscription.date_c);
          if (eventSubscription.event_type === 'consent_approved') {
            expect(eventSubscription.handler).toBe('OnConsentApproved');
          } else if (eventSubscription.event_type === 'data_declined') {
            expect(eventSubscription.handler).toBe('OnDataDeclined');
          } else {
            // This should not be called.
            expect(true).toBe(false);
          }
          assertIsCursorLike(eventSubscription.owner_cursor);

          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown campaign ID', async () => {

        it('should throw an error', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const campaignId = 'unknown';
          try {
            await EventSubscriptionsApi.listEventSubscriptions(apiUrlRoot, apiAccessToken, campaignId);
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
