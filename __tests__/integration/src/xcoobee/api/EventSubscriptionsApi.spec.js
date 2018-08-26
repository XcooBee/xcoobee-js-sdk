import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import EventSubscriptionsApi from '../../../../../src/xcoobee/api/EventSubscriptionsApi';

import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

import { addTestEventSubscriptions, deleteAllEventSubscriptions } from '../../../../lib/EventSubscriptionUtils';
import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventSubscriptionsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  beforeAll(async function (done) {
    const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
    await deleteAllEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

    done();
  });

  describe('.addEventSubscription', function () {

    describe('called with a valid API access token', function () {

      describe('and a known campaign ID', function () {

        describe('and a valid events mapping', function () {

          afterEach(async function (done) {
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            await deleteAllEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

            done();
          });

          it('should add the event subscriptions', async function (done) {
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

          it('should throw an error when trying to add an existing event subscription type', async function (done) {
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

        describe('and an invalid events mapping', function () {

          it('should throw an error', async function (done) {
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

      describe('and an unknown campaign ID', async function () {

        it('should throw an error', async function (done) {
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

  describe('.deleteEventSubscription', function () {

    describe('called with a valid API access token', function () {

      describe('and a known campaign ID', function () {

        describe('and a valid events mapping', function () {

          beforeEach(async function (done) {
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            await addTestEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

            done();
          });

          it('should delete both of the event subscriptions', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const eventsMapping = {
              ConsentApproved: 'OnConsentApproved',
              DataDeclined: 'OnDataDeclined',
            };
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            const deleted_number = await EventSubscriptionsApi.deleteEventSubscription(
              apiUrlRoot, apiAccessToken, eventsMapping, campaignId
            );
            expect(deleted_number).toBe(2);

            done();
          });// eo it

          it('should delete each of the event subscriptions', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            let eventsMapping = {
              ConsentApproved: 'OnConsentApproved',
            };
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            let deleted_number = await EventSubscriptionsApi.deleteEventSubscription(
              apiUrlRoot, apiAccessToken, eventsMapping, campaignId
            );
            expect(deleted_number).toBe(1);

            eventsMapping = {
              DataDeclined: 'OnDataDeclined',
            };
            deleted_number = await EventSubscriptionsApi.deleteEventSubscription(
              apiUrlRoot, apiAccessToken, eventsMapping, campaignId
            );
            expect(deleted_number).toBe(1);

            done();
          });// eo it
        });// eo describe

        describe('and an invalid events mapping', function () {

          it('should throw an error', async function (done) {
            const apiAccessToken = 'should_not_matter_expecting_to_fail_fast';
            const eventsMapping = {
              Invalid: 'invalid',
            };
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            try {
              await EventSubscriptionsApi.deleteEventSubscription(
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

      describe('and an unknown campaign ID', async function () {

        it('should throw an error', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const eventsMapping = {
            ConsentApproved: 'OnConsentApproved',
          };
          const campaignId = 'unknown';
          try {
            await EventSubscriptionsApi.deleteEventSubscription(apiUrlRoot, apiAccessToken, eventsMapping, campaignId);
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

  describe('.listEventSubscriptions', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known campaign ID', function () {

        beforeEach(async function (done) {
          const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
          await addTestEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

          done();
        });

        afterEach(async function (done) {
          const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
          await deleteAllEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId);

          done();
        });

        it('should return with a list of event subscriptions', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
          const eventSubscriptionsPage = await EventSubscriptionsApi.listEventSubscriptions(
            apiUrlRoot, apiAccessToken, campaignId
          );
          expect(eventSubscriptionsPage).toBeDefined();
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
          expect(eventSubscriptionsPage.page_info).toBe(null);

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
          expect(eventSubscriptionsPage.page_info).toBe(null);

          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown campaign ID', async function () {

        it('should throw an error', async function (done) {
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
