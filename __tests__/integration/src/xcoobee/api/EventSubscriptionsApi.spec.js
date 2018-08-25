import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import EventSubscriptionsApi from '../../../../../src/xcoobee/api/EventSubscriptionsApi';

import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventSubscriptionsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.addEventSubscription', function () {

    describe('called with a valid API access token', function () {

      describe('and a known campaign ID', function () {

        xdescribe('and a valid events mapping', function () {

          it('should add the event subscriptions', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const eventsMapping = {
              ConsentApproved: 'OnConsentApproved',
            };
            const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
            const eventSubscriptions = await EventSubscriptionsApi.addEventSubscription(
              apiUrlRoot, apiAccessToken, eventsMapping, campaignId
            );
            expect(eventSubscriptions).toBeInstanceOf(Array);
            expect(eventSubscriptions.length).toBe(1);
            const eventSubscription = eventSubscriptions[0];
            expect(eventSubscription.date_c).toBe('');
            expect(eventSubscription.handler).toBe('');
            expect(eventSubscription.event_type).toBe('');
            // TODO: Add more expectations.

            done();
          });// eo it

        });// eo describe

        describe('and an invalid events mapping', function () {

          it('should throw an error', async function (done) {
            const apiAccessToken = 'should_not_matter_expecting_to_fail_fast';
            const eventsMapping = {
              Invalid: 'invalid',
            };
            const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
            try {
              await EventSubscriptionsApi.addEventSubscription(apiUrlRoot, apiAccessToken, eventsMapping, campaignId);
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

        xdescribe('and a valid events mapping', function () {

          it('should add the event subscriptions', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const eventsMapping = {
              ConsentApproved: 'OnConsentApproved',
            };
            const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
            const deleted_number = await EventSubscriptionsApi.deleteEventSubscription(
              apiUrlRoot, apiAccessToken, eventsMapping, campaignId
            );
            expect(typeof deleted_number).toBe('number');
            // TODO: Add more expectations.

            done();
          });// eo it

        });// eo describe

        describe('and an invalid events mapping', function () {

          it('should throw an error', async function (done) {
            const apiAccessToken = 'should_not_matter_expecting_to_fail_fast';
            const eventsMapping = {
              Invalid: 'invalid',
            };
            const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
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

        it('should return with a list of event subscriptions', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
          const eventSubscriptionsPage = await EventSubscriptionsApi.listEventSubscriptions(
            apiUrlRoot, apiAccessToken, campaignId
          );
          expect(eventSubscriptionsPage).toBeDefined();
          expect(eventSubscriptionsPage.data).toBeInstanceOf(Array);
          expect(eventSubscriptionsPage.data.length).toBe(1);
          const eventSubscription = eventSubscriptionsPage.data[0];
          expect(eventSubscription.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
          assertIso8601Like(eventSubscription.date_c);
          expect(eventSubscription.event_type).toBe('consent_approved');
          expect(eventSubscription.handler).toBe('OnConsentApproved');
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
