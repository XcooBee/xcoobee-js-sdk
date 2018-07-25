import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';
import Config from '../../../../../src/xcoobee/sdk/Config';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';
import System from '../../../../../src/xcoobee/sdk/System';
import UsersCache from '../../../../../src/xcoobee/sdk/UsersCache';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('System', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    describe('.getEvents', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s events', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.getEvents();
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const events = response.data;
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
            });
            const overridingConfig = new Config({
              apiKey,
              apiSecret,
            });

            const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await systemSdk.getEvents(overridingConfig);
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const events = response.data;
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
          });

          const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
          const response = await systemSdk.getEvents();
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.errors).toBeInstanceOf(Array);
          expect(response.errors.length).toBe(1);
          expect(response.errors[0].message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.getEvents')

    describe('.listEventSubscriptions', function () {

      describe('called with a valid API key/secret pair', function () {

        xdescribe('and known campaign ID', function () {

          describe('using default config', function () {

            it('should fetch and return with the event subscriptions for the campaign', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                campaignId: 'known', // FIXME: TODO: Get a legit campaign cursor.
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.listEventSubscriptions();
              expect(response).toBeInstanceOf(SuccessResponse);
              const eventSubscriptions = response.data;
              expect(eventSubscriptions).toBeInstanceOf(Array);
              expect(eventSubscriptions.length).toBe(0);
              // TODO: Add more expectations.
              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should fetch and return with the event subscriptions for the campaign', async function (done) {
              const defaultConfig = new Config({
                apiKey: 'should_be_unused',
                apiSecret: 'should_be_unused',
                campaignId: 'default-campaign-id',
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                campaignId: 'overriding-campaign-id', // FIXME: TODO: Get a legit campaign cursor.
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.listEventSubscriptions(null, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const events = response.data;
              expect(events).toBeInstanceOf(Array);
              expect(events.length).toBe(0);
              // TODO: Add more expectations.
              done();
            });// eo it

          });// eo describe

          describe('using campaign ID', function () {

            it('should fetch and return with the event subscriptions for the campaign', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                campaignId: 'default-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                campaignId: 'overriding-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const campaignId = 'known'; // FIXME: TODO: Get a legit campaign cursor.

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.listEventSubscriptions(campaignId);
              expect(response).toBeInstanceOf(SuccessResponse);
              let eventSubscriptions = response.data;
              expect(eventSubscriptions).toBeInstanceOf(Array);
              expect(eventSubscriptions.length).toBe(0);
              // TODO: Add more expectations.

              response = await systemSdk.listEventSubscriptions(campaignId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              eventSubscriptions = response.data;
              expect(eventSubscriptions).toBeInstanceOf(Array);
              expect(eventSubscriptions.length).toBe(0);
              // TODO: Add more expectations.

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
                campaignId: 'unknown',
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.listEventSubscriptions();
              expect(response).toBeInstanceOf(ErrorResponse);
              let errors = response.errors;
              expect(errors).toBeInstanceOf(Array);
              expect(errors.length).toBe(1);
              let error = errors[0];
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.listEventSubscriptions(null);
              expect(response).toBeInstanceOf(ErrorResponse);
              errors = response.errors;
              expect(errors).toBeInstanceOf(Array);
              expect(errors.length).toBe(1);
              error = errors[0];
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.listEventSubscriptions(null, { apiKey, apiSecret });
              expect(response).toBeInstanceOf(ErrorResponse);
              errors = response.errors;
              expect(errors).toBeInstanceOf(Array);
              expect(errors.length).toBe(1);
              error = errors[0];
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
                campaignId: 'known', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                campaignId: 'unknown',
              });

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await systemSdk.listEventSubscriptions(null, overridingConfig);
              expect(response).toBeInstanceOf(ErrorResponse);
              const errors = response.errors;
              expect(errors).toBeInstanceOf(Array);
              expect(errors.length).toBe(1);
              const error = errors[0];
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
                campaignId: 'default-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const overridingConfig = new Config({
                apiKey,
                apiSecret,
                campaignId: 'overriding-campaign-id', // FIXME: TODO: Use other legit campaign cursors so we can make sure they are not being used.
              });
              const campaignId = 'unknown';

              const systemSdk = new System(defaultConfig, apiAccessTokenCache, usersCache);
              let response = await systemSdk.listEventSubscriptions(campaignId);
              expect(response).toBeInstanceOf(ErrorResponse);
              let errors = response.errors;
              expect(errors).toBeInstanceOf(Array);
              expect(errors.length).toBe(1);
              let error = errors[0];
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              response = await systemSdk.listEventSubscriptions(campaignId, overridingConfig);
              expect(response).toBeInstanceOf(ErrorResponse);
              errors = response.errors;
              expect(errors).toBeInstanceOf(Array);
              expect(errors.length).toBe(1);
              error = errors[0];
              expect(error).toBeInstanceOf(XcooBeeError);
              expect(error.message).toBe('Wrong key at line: 3, column: 7');
              expect(error.name).toBe('XcooBeeError');

              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

    });// eo describe('.listEventSubscriptions')

  });// eo describe('instance')

});// eo describe('System')
