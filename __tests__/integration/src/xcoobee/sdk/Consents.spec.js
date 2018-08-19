import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import ConsentStatuses from '../../../../../src/xcoobee/api/ConsentStatuses';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import Config from '../../../../../src/xcoobee/sdk/Config';
import Consents from '../../../../../src/xcoobee/sdk/Consents';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Consents', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    describe('.confirmConsentChange', function () {

      describe('called with a valid API key/secret pair', function () {

        xdescribe('and a known consent ID', function () {

          describe('using default config', function () {

            it('should return flag indicating if the consent change has been confirmed', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
              const response = await consentsSdk.confirmConsentChange(consentId);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { results } = response;
              expect(results).toBeDefined();
              expect(typeof results.confirmed).toBe('boolean');

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should return flag indicating if the consent change has been confirmed', async function (done) {
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
              const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
              const response = await consentsSdk.confirmConsentChange(consentId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { results } = response;
              expect(results).toBeDefined();
              expect(typeof results.confirmed).toBe('boolean');

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
          const consentId = 'does not matter';
          const response = await consentsSdk.confirmConsentChange(consentId);
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.confirmConsentChange')

    describe('.confirmDataDelete', function () {

      describe('called with a valid API key/secret pair', function () {

        xdescribe('and a known consent ID', function () {

          describe('using default config', function () {

            it('should return flag indicating if the data has been deleted/purged', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
              const response = await consentsSdk.confirmDataDelete(consentId);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { results } = response;
              expect(results).toBeDefined();
              expect(typeof results.confirmed).toBe('boolean');

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should return flag indicating if the data has been deleted/purged', async function (done) {
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
              const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
              const response = await consentsSdk.confirmDataDelete(consentId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { results } = response;
              expect(results).toBeDefined();
              expect(typeof results.confirmed).toBe('boolean');

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
          const consentId = 'does not matter';
          const response = await consentsSdk.confirmDataDelete(consentId);
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.confirmDataDelete')

    describe('.getCampaignInfo', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('and a known campaign ID', function () {

          describe('using default config', function () {

            it('should fetch and return with expected campaign info', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
              const response = await consentsSdk.getCampaignInfo(campaignId);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { results } = response;
              expect(results).toBeDefined();
              expect(results.campaign).toBeDefined();
              const { campaign } = results;
              expect(campaign.campaign_description.text).toBe(undefined);
              expect(campaign.campaign_name).toBe('xcoobee test campaign');
              expect(campaign.campaign_title.text).toBe(undefined);
              expect(campaign.date_c).toBeDefined();
              expect(campaign.date_e).toBeDefined();
              expect(campaign.email_targets).toBeInstanceOf(Array);
              expect(campaign.email_targets.length).toBe(0);
              expect(campaign.endpoint).toBe(null);
              expect(campaign.status).toBe('active');
              expect(campaign.targets).toBeInstanceOf(Array);
              expect(campaign.targets.length).toBe(0);
              expect(campaign.xcoobee_targets).toBeInstanceOf(Array);
              expect(campaign.xcoobee_targets.length).toBe(0);

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should fetch and return with expected campaign info', async function (done) {
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
              const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
              const response = await consentsSdk.getCampaignInfo(campaignId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { results } = response;
              expect(results).toBeDefined();
              expect(results.campaign).toBeDefined();
              const { campaign } = results;
              expect(campaign.campaign_description.text).toBe(undefined);
              expect(campaign.campaign_name).toBe('xcoobee test campaign');
              expect(campaign.campaign_title.text).toBe(undefined);
              expect(campaign.date_c).toBeDefined();
              expect(campaign.date_e).toBeDefined();
              expect(campaign.email_targets).toBeInstanceOf(Array);
              expect(campaign.email_targets.length).toBe(0);
              expect(campaign.endpoint).toBe(null);
              expect(campaign.status).toBe('active');
              expect(campaign.targets).toBeInstanceOf(Array);
              expect(campaign.targets.length).toBe(0);
              expect(campaign.xcoobee_targets).toBeInstanceOf(Array);
              expect(campaign.xcoobee_targets.length).toBe(0);

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
          const campaignId = 'does not matter';
          const response = await consentsSdk.getCampaignInfo(campaignId);
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.getCampaignInfo')

    describe('.getConsentData', function () {

      describe('called with a valid API key/secret pair', function () {

        xdescribe('and a known consent ID', function () {

          describe('using default config', function () {

            it('should fetch and return with consent info', async function (done) {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
              const response = await consentsSdk.getConsentData(consentId);
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const consent = response.results;
              expect(consent).toBeDefined();
              // TODO: Add more expectations.
              done();
            });// eo it

          });// eo describe

          describe('using overriding config', function () {

            it('should fetch and return with consent info', async function (done) {
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
              const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
              const response = await consentsSdk.getConsentData(consentId, overridingConfig);
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const consent = response.results;
              expect(consent).toBeDefined();
              // TODO: Add more expectations.
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
          const consentId = 'does not matter';
          const response = await consentsSdk.getConsentData(consentId);
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.getConsentData')

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
            const campaigns = response.results;
            expect(campaigns).toBeDefined();
            expect(campaigns).toBeInstanceOf(Array);
            expect(campaigns.length).toBe(1);
            const campaign = campaigns[0];
            expect(campaign).toBeDefined();
            expect(campaign.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
            expect(campaign.campaign_name).toBe('xcoobee test campaign');
            expect(campaign.status).toBe('active');

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

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await consentsSdk.listCampaigns(overridingConfig);
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const campaigns = response.results;
            expect(campaigns).toBeDefined();
            expect(campaigns).toBeInstanceOf(Array);
            expect(campaigns.length).toBe(1);
            const campaign = campaigns[0];
            expect(campaign).toBeDefined();
            expect(campaign.campaign_cursor).toBe('CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==');
            expect(campaign.campaign_name).toBe('xcoobee test campaign');
            expect(campaign.status).toBe('active');

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
          expect(response.error.message).toBe('Unable to get an API access token.');
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
              const consents = response.results;
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
              const consents = response.results;
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
              const consents = response.results;
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
              const consents = response.results;
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
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.listConsents')

  });// eo describe('instance')

});// eo describe('Consents')
