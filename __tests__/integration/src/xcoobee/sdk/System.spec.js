import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

import Config from '../../../../../src/xcoobee/sdk/Config';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';
import System from '../../../../../src/xcoobee/sdk/System';

import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('System', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    // FIXME: TODO: Delete event subscripts before adding.
    // FIXME: TODO: Get the event subscriptions to a known state, add, list, delete.
    describe('.addEventSubscription', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('and a known campaign ID', function () {

          xdescribe('and a valid events mapping', function () {

            describe('using default config', function () {

              it('should fetch and return with the event subscriptions for the campaign', async function (done) {
                const defaultConfig = new Config({
                  apiKey,
                  apiSecret,
                  apiUrlRoot,
                  campaignId: 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==',
                });
                const eventsMapping = {
                  ConsentApproved: 'OnConsentApproved',
                };

                const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
                const response = await systemSdk.addEventSubscription(eventsMapping);
                expect(response).toBeInstanceOf(SuccessResponse);
                const eventSubscriptions = response.results;
                expect(eventSubscriptions).toBeInstanceOf(Array);
                expect(eventSubscriptions.length).toBe(1);
                const eventSubscription = eventSubscriptions[0];
                expect('data_c' in eventSubscription).toBe(true);
                expect(eventSubscription.handler).toBe('OnConsentApproved');
                expect(eventSubscription.event_type).toBe('consent_approved');
                // TODO: Add more expectations.

                done();
              });// eo it

            });// eo describe

            describe('using overriding config', function () {

              it('should fetch and return with the event subscriptions for the campaign', async function (done) {
                const defaultConfig = new Config({
                  apiKey: 'should_be_unused',
                  apiSecret: 'should_be_unused',
                  apiUrlRoot: 'should_be_unused',
                  campaignId: 'default-campaign-id',
                });
                const eventsMapping = {
                  ConsentApproved: 'OnConsentApproved',
                };
                const overridingConfig = new Config({
                  apiKey,
                  apiSecret,
                  apiUrlRoot,
                  campaignId: 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==',
                });

                const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
                const response = await systemSdk.addEventSubscription(eventsMapping, null, overridingConfig);
                expect(response).toBeInstanceOf(SuccessResponse);
                const eventSubscriptions = response.results;
                expect(eventSubscriptions).toBeInstanceOf(Array);
                expect(eventSubscriptions.length).toBe(1);
                const eventSubscription = eventSubscriptions[0];
                expect('data_c' in eventSubscription).toBe(true);
                expect(eventSubscription.handler).toBe('OnConsentApproved');
                expect(eventSubscription.event_type).toBe('consent_approved');
                // TODO: Add more expectations.

                done();
              });// eo it

            });// eo describe

            describe('using campaign ID', function () {

              it('should fetch and return with the event subscriptions for the campaign', async function (done) {
                const defaultConfig = new Config({
                  apiKey,
                  apiSecret,
                  apiUrlRoot,
                  campaignId: 'default-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
                });
                const eventsMapping = {
                  ConsentApproved: 'OnConsentApproved',
                };
                const overridingConfig = new Config({
                  apiKey,
                  apiSecret,
                  apiUrlRoot,
                  campaignId: 'overriding-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
                });
                const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';

                const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
                let response = await systemSdk.addEventSubscription(eventsMapping, campaignId);
                expect(response).toBeInstanceOf(SuccessResponse);
                let eventSubscriptions = response.results;
                expect(eventSubscriptions).toBeInstanceOf(Array);
                expect(eventSubscriptions.length).toBe(1);
                let eventSubscription = eventSubscriptions[0];
                expect('data_c' in eventSubscription).toBe(true);
                expect(eventSubscription.handler).toBe('OnConsentApproved');
                expect(eventSubscription.event_type).toBe('consent_approved');
                // TODO: Add more expectations.

                response = await systemSdk.addEventSubscription(eventsMapping, campaignId, overridingConfig);
                expect(response).toBeInstanceOf(SuccessResponse);
                eventSubscriptions = response.results;
                expect(eventSubscriptions).toBeInstanceOf(Array);
                expect(eventSubscriptions.length).toBe(1);
                eventSubscription = eventSubscriptions[0];
                expect('data_c' in eventSubscription).toBe(true);
                expect(eventSubscription.handler).toBe('OnConsentApproved');
                expect(eventSubscription.event_type).toBe('consent_approved');
                // TODO: Add more expectations.

                done();
              });// eo it

            });// eo describe

          });// eo describe

          describe('and an invalid events mapping', function () {

            it('should return an error response', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'known', // FIXME: TODO: Get a legit campaign ID.
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'known', // FIXME: TODO: Get a legit campaign ID.
              });
              const eventsMapping = {
                Invalid: 'invalid',
              };
              const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);

              let response = await systemSdk.addEventSubscription(eventsMapping);
              expect(response).toBeInstanceOf(ErrorResponse);
              let { error } = response;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Invalid event type provided: "Invalid".');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.addEventSubscription(eventsMapping, campaignId);
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Invalid event type provided: "Invalid".');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.addEventSubscription(eventsMapping, campaignId, overridingConfig);
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Invalid event type provided: "Invalid".');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

        });// eo describe

        describe('and unknown campaign ID', function () {

          describe('using default config', function () {

            it('should return an error response', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'unknown',
              });
              const eventsMapping = {
                ConsentApproved: 'OnConsentApproved',
              };

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.addEventSubscription(eventsMapping);
              expect(response).toBeInstanceOf(ErrorResponse);
              let { error } = response;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.addEventSubscription(eventsMapping, null);
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.addEventSubscription(eventsMapping, null, { apiKey, apiSecret });
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should return an error response', async function (done) {
              const defaultConfig = new Config({
                apiKey: 'should_be_unused',
                apiSecret: 'should_be_unused',
                apiUrlRoot: 'should_be_unused',
                campaignId: 'known', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'unknown',
              });
              const eventsMapping = {
                ConsentApproved: 'OnConsentApproved',
              };

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.addEventSubscription(eventsMapping, null, overridingConfig);
              expect(response).toBeInstanceOf(ErrorResponse);
              const { error } = response;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

          describe('using campaign ID', function () {

            it('should return an error response', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'default-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'overriding-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const campaignId = 'unknown';
              const eventsMapping = {
                ConsentApproved: 'OnConsentApproved',
              };

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.addEventSubscription(eventsMapping, campaignId);
              expect(response).toBeInstanceOf(ErrorResponse);
              let { error } = response;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.addEventSubscription(eventsMapping, campaignId, overridingConfig);
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

    });// eo describe('.addEventSubscription')

    describe('.getEvents', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s events', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.getEvents();
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const events = response.results;
            expect(events).toBeDefined();
            expect(events).toBeInstanceOf(Array);
            expect(events.length).toBe(0);
            // TODO: Add more expectations.
            done();
          });// eo it

        });// eo describe

        describe('using overriding config', function () {

          it('should fetch and return with the user\'s events', async function (done) {
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
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const events = response.results;
            expect(events).toBeDefined();
            expect(events).toBeInstanceOf(Array);
            expect(events.length).toBe(0);
            // TODO: Add more expectations.
            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', function () {

        it('should return with an error response', async function (done) {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
          const response = await systemSdk.getEvents();
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.getEvents')

    describe('.listEventSubscriptions', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('and known campaign ID', function () {

          describe('using default config', function () {

            it('should fetch and return with the event subscriptions for the campaign', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==',
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.listEventSubscriptions();
              expect(response).toBeInstanceOf(SuccessResponse);
              const eventSubscriptionsPage = response.result;
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

          describe('using overriding config', function () {

            it('should fetch and return with the event subscriptions for the campaign', async function (done) {
              const defaultConfig = new Config({
                apiKey: 'should_be_unused',
                apiSecret: 'should_be_unused',
                apiUrlRoot: 'should_be_unused',
                campaignId: 'default-campaign-id',
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==',
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.listEventSubscriptions(null, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const eventSubscriptionsPage = response.result;
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

          describe('using campaign ID', function () {

            it('should fetch and return with the event subscriptions for the campaign', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'default-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'overriding-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.listEventSubscriptions(campaignId);
              expect(response).toBeInstanceOf(SuccessResponse);
              let eventSubscriptionsPage = response.result;
              expect(eventSubscriptionsPage).toBeDefined();
              expect(eventSubscriptionsPage.data).toBeInstanceOf(Array);
              expect(eventSubscriptionsPage.data.length).toBe(1);
              let eventSubscription = eventSubscriptionsPage.data[0];
              expect(eventSubscription.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
              assertIso8601Like(eventSubscription.date_c);
              expect(eventSubscription.event_type).toBe('consent_approved');
              expect(eventSubscription.handler).toBe('OnConsentApproved');
              assertIsCursorLike(eventSubscription.owner_cursor);
              expect(eventSubscriptionsPage.page_info).toBe(null);

              response = await systemSdk.listEventSubscriptions(campaignId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              eventSubscriptionsPage = response.result;
              expect(eventSubscriptionsPage).toBeDefined();
              expect(eventSubscriptionsPage.data).toBeInstanceOf(Array);
              expect(eventSubscriptionsPage.data.length).toBe(1);
              eventSubscription = eventSubscriptionsPage.data[0];
              expect(eventSubscription.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
              assertIso8601Like(eventSubscription.date_c);
              expect(eventSubscription.event_type).toBe('consent_approved');
              expect(eventSubscription.handler).toBe('OnConsentApproved');
              assertIsCursorLike(eventSubscription.owner_cursor);
              expect(eventSubscriptionsPage.page_info).toBe(null);

              done();
            });// eo it

          });// eo describe

        });// eo describe

        describe('and unknown campaign ID', function () {

          describe('using default config', function () {

            it('should return an error response', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'unknown',
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.listEventSubscriptions();
              expect(response).toBeInstanceOf(ErrorResponse);
              let { error } = response;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.listEventSubscriptions(null);
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.listEventSubscriptions(null, { apiKey, apiSecret });
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should return an error response', async function (done) {
              const defaultConfig = new Config({
                apiKey: 'should_be_unused',
                apiSecret: 'should_be_unused',
                apiUrlRoot: 'should_be_unused',
                campaignId: 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==',
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'unknown',
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.listEventSubscriptions(null, overridingConfig);
              expect(response).toBeInstanceOf(ErrorResponse);
              const { error } = response;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

          describe('using campaign ID', function () {

            it('should return an error response', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==',
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
                campaignId: 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==',
              });
              const campaignId = 'unknown';

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.listEventSubscriptions(campaignId);
              expect(response).toBeInstanceOf(ErrorResponse);
              let { error } = response;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.listEventSubscriptions(campaignId, overridingConfig);
              expect(response).toBeInstanceOf(ErrorResponse);
              error = response.error;
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

    });// eo describe('.listEventSubscriptions')

    describe('.ping', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config without a campaign ID', function () {

          it('should error out due to not resolving a campaign ID', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.ping();
            expect(response).toBeInstanceOf(ErrorResponse);
            let { error } = response;
            expect(error).toBeInstanceOf(XcooBeeError);
            expect(error.message).toBe('Campaign ID is required');
            expect(error.name).toBe('XcooBeeError');

            done();
          });// eo it

        });// eo describe

        describe('using default config with a valid campaign ID', function () {

          it('should be successful', async function (done) {
            const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
              campaignId,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.ping();
            expect(response).toBeInstanceOf(SuccessResponse);
            let { results } = response;
            expect(results).toBeDefined();
            expect(results.ponged).toBe(true);

            done();
          });// eo it

        });// eo describe

        describe('using default config with an unknown campaign ID', function () {

          it('should error out due to not finding a campaign', async function (done) {
            const campaignId = 'unknown';
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
              campaignId,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.ping();
            expect(response).toBeInstanceOf(ErrorResponse);
            let { error } = response;
            expect(error).toBeInstanceOf(XcooBeeError);
            expect(error.message === 'Wrong key at line: 3, column: 7' || error.message === 'Campaign not found.').toBe(true);
            expect(error.name).toBe('XcooBeeError');

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.ping')

  });// eo describe('instance')

});// eo describe('System')
