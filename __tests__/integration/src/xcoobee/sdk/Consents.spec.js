import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import ConsentStatuses from '../../../../../src/xcoobee/api/ConsentStatuses';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import Config from '../../../../../src/xcoobee/sdk/Config';
import Consents from '../../../../../src/xcoobee/sdk/Consents';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Consents', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    describe('.listCampaigns', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s events', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await consentsSdk.listCampaigns();
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const campaigns = response.data;
            expect(campaigns).toBeDefined();
            expect(campaigns).toBeInstanceOf(Array);
            expect(campaigns.length).toBe(0);
            // TODO: Add more expectations.
            done();
          });// eo it

        });// eo describe

        describe('using overriding config', function () {

          it('should fetch and return with user events', async function (done) {
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

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await consentsSdk.listCampaigns(overridingConfig);
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const campaigns = response.data;
            expect(campaigns).toBeDefined();
            expect(campaigns).toBeInstanceOf(Array);
            expect(campaigns.length).toBe(0);
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

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const response = await consentsSdk.listCampaigns();
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.errors).toBeInstanceOf(Array);
          expect(response.errors.length).toBe(1);
          expect(response.errors[0].message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.listCampaigns')

    describe('.listConsents', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('but no consent status', function () {

          describe('using default config', function () {

            it('should fetch and return with the user\'s consents of any status', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await consentsSdk.listConsents();
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const consents = response.data;
              expect(consents).toBeInstanceOf(Array);
              expect(consents.length).toBe(0);
              // let consent = consents[0];
              // expect('consent_cursor' in consent).toBe(true);
              // assertIsCursorLike(consent.consent_cursor);
              // expect('consent_status' in consent).toBe(true);
              // expect('date_c' in consent).toBe(true);
              // assertIso8601Like(consent.date_c)
              // expect('date_e' in consent).toBe(true);
              // assertIso8601Like(consent.date_e)
              // expect('user_xcoobee_id' in consent).toBe(true);
              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should fetch and return with the user\'s consents of any status', async function (done) {
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

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await consentsSdk.listConsents(null, overridingConfig);
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const consents = response.data;
              expect(consents).toBeDefined();
              expect(consents).toBeInstanceOf(Array);
              expect(consents.length).toBe(0);
              // let consent = consents[0];
              // expect('consent_cursor' in consent).toBe(true);
              // assertIsCursorLike(consent.consent_cursor);
              // expect('consent_status' in consent).toBe(true);
              // expect('date_c' in consent).toBe(true);
              // assertIso8601Like(consent.date_c)
              // expect('date_e' in consent).toBe(true);
              // assertIso8601Like(consent.date_e)
              // expect('user_xcoobee_id' in consent).toBe(true);
              done();
            });// eo it

          });// eo describe

        });// eo describe

        describe('and active consent status', function () {

          describe('using default config', function () {

            it('should fetch and return with the user\'s active consents', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await consentsSdk.listConsents(ConsentStatuses.ACTIVE);
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const consents = response.data;
              expect(consents).toBeInstanceOf(Array);
              expect(consents.length).toBe(0);
              // let consent = consents[0];
              // expect('consent_cursor' in consent).toBe(true);
              // assertIsCursorLike(consent.consent_cursor);
              // expect('consent_status' in consent).toBe(true);
              // expect('date_c' in consent).toBe(true);
              // assertIso8601Like(consent.date_c)
              // expect('date_e' in consent).toBe(true);
              // assertIso8601Like(consent.date_e)
              // expect('user_xcoobee_id' in consent).toBe(true);
              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should fetch and return with the user\'s active consents', async function (done) {
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

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await consentsSdk.listConsents(ConsentStatuses.ACTIVE, overridingConfig);
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const consents = response.data;
              expect(consents).toBeDefined();
              expect(consents).toBeInstanceOf(Array);
              expect(consents.length).toBe(0);
              // let consent = consents[0];
              // expect('consent_cursor' in consent).toBe(true);
              // assertIsCursorLike(consent.consent_cursor);
              // expect('consent_status' in consent).toBe(true);
              // expect('date_c' in consent).toBe(true);
              // assertIso8601Like(consent.date_c)
              // expect('date_e' in consent).toBe(true);
              // assertIso8601Like(consent.date_e)
              // expect('user_xcoobee_id' in consent).toBe(true);
              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', function () {

        it('should return with an error response', async function (done) {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const consentStatus = 'does not matter';
          const response = await consentsSdk.listConsents(consentStatus);
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.errors).toBeInstanceOf(Array);
          expect(response.errors.length).toBe(1);
          expect(response.errors[0].message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.listConsents')

  });// eo describe('instance')

});// eo describe('Consents')
