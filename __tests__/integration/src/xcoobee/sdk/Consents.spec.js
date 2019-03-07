const Path = require('path');

const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const ConsentDataTypes = require('../../../../../src/xcoobee/api/ConsentDataTypes');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const Config = require('../../../../../src/xcoobee/sdk/Config');
const Consents = require('../../../../../src/xcoobee/sdk/Consents');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');

const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Consents', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', () => {

    describe('.confirmConsentChange', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('and a known consent ID', () => {

          describe('using default config', () => {

            it('should return flag indicating if the consent change has been confirmed', async (done) => {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const consents = await consentsSdk.listConsents();
              const consentId = consents.result.data[0].consent_cursor;
              const response = await consentsSdk.confirmConsentChange(consentId);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(result.confirmed).toBe(true);

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', () => {

            it('should return flag indicating if the consent change has been confirmed', async (done) => {
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
              const consents = await consentsSdk.listConsents([], overridingConfig);
              const consentId = consents.result.data[0].consent_cursor;
              const response = await consentsSdk.confirmConsentChange(consentId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(typeof result.confirmed).toBe('boolean');

              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const consentId = 'does not matter';

          try {
            await consentsSdk.confirmConsentChange(consentId);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.confirmConsentChange')

    describe('.confirmDataDelete', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('and a known consent ID', () => {

          describe('using default config', () => {

            it('should return flag indicating if the data has been deleted/purged', async (done) => {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const consents = await consentsSdk.listConsents();
              const consentId = consents.result.data[0].consent_cursor;
              const response = await consentsSdk.confirmDataDelete(consentId);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(typeof result.confirmed).toBe('boolean');

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', () => {

            it('should return flag indicating if the data has been deleted/purged', async (done) => {
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
              const consents = await consentsSdk.listConsents([], overridingConfig);
              const consentId = consents.result.data[0].consent_cursor;
              const response = await consentsSdk.confirmDataDelete(consentId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(typeof result.confirmed).toBe('boolean');

              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const consentId = 'does not matter';

          try {
            await consentsSdk.confirmDataDelete(consentId);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.confirmDataDelete')

    describe('.getCampaignInfo', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('and a known campaign ID', () => {

          describe('using default config', () => {

            it('should fetch and return with expected campaign info', async (done) => {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const campaigns = await consentsSdk.listCampaigns();
              const campaignId = campaigns.result.data[0].campaign_cursor;
              const response = await consentsSdk.getCampaignInfo(campaignId);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(result.campaign).toBeDefined();
              const { campaign } = result;
              expect(campaign.campaign_description.text).toBe(undefined);
              expect(campaign.campaign_name).toBe('Test campaign');
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

          describe('using overriding config', () => {

            it('should fetch and return with expected campaign info', async (done) => {
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
              const campaigns = await consentsSdk.listCampaigns(overridingConfig);
              const campaignId = campaigns.result.data[0].campaign_cursor;
              const response = await consentsSdk.getCampaignInfo(campaignId, overridingConfig);
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(result.campaign).toBeDefined();
              const { campaign } = result;
              expect(campaign.campaign_description.text).toBe(undefined);
              expect(campaign.campaign_name).toBe('Test campaign');
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

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const campaignId = 'does not matter';

          try {
            await consentsSdk.getCampaignInfo(campaignId);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.getCampaignInfo')

    describe('.getConsentData', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('and a known consent ID', () => {

          describe('using default config', () => {

            it('should fetch and return with consent info', async (done) => {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
              const xcoobeeId = user.xcoobee_id;
              const consents = await consentsSdk.listConsents();
              const consentId = consents.result.data[0].consent_cursor;
              const response = await consentsSdk.getConsentData(consentId);
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(result.consent).toBeDefined();
              const consent = result.consent;
              expect(consent.consent_description).toBe('Test campaign description');
              expect(consent.request_owner).toBe(xcoobeeId);
              expect(consent.user_xcoobee_id).toBe(xcoobeeId);
              assertIsCursorLike(consent.user_cursor);
              assertIso8601Like(consent.date_c);
              done();
            });// eo it

          });// eo describe

          describe('using overriding config', () => {

            it('should fetch and return with consent info', async (done) => {
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
              const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
              const xcoobeeId = user.xcoobee_id;
              const consents = await consentsSdk.listConsents([], overridingConfig);
              const consentId = consents.result.data[0].consent_cursor;
              const response = await consentsSdk.getConsentData(consentId, overridingConfig);
              expect(response).toBeDefined();
              expect(response).toBeInstanceOf(SuccessResponse);
              const { result } = response;
              expect(result).toBeDefined();
              expect(result.consent).toBeDefined();
              const consent = result.consent;
              expect(consent.consent_description).toBe('Test campaign description');
              expect(consent.request_owner).toBe(xcoobeeId);
              expect(consent.user_xcoobee_id).toBe(xcoobeeId);
              assertIsCursorLike(consent.user_cursor);
              assertIso8601Like(consent.date_c);
              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const consentId = 'does not matter';

          try {
            await consentsSdk.getConsentData(consentId);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.getConsentData')

    describe('.getCookieConsent', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with cookie consent info', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const xcoobeeId = user.xcoobee_id;
            const campaigns = await consentsSdk.listCampaigns();
            const campaignId = campaigns.result.data[0].campaign_cursor;
            const response = await consentsSdk.getCookieConsent(xcoobeeId, campaignId);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.cookie_consents).toBeDefined();
            const { cookie_consents } = result;
            expect(cookie_consents[ConsentDataTypes.ADVERTISING_COOKIE]).toBe(false);
            expect(cookie_consents[ConsentDataTypes.APPLICATION_COOKIE]).toBe(false);
            expect(cookie_consents[ConsentDataTypes.STATISTICS_COOKIE]).toBe(false);
            expect(cookie_consents[ConsentDataTypes.USAGE_COOKIE]).toBe(false);

            done();
          });// eo it

        });// eo describe

        describe('using overriding config', () => {

          it('should fetch and return with cookie consent info', async (done) => {
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
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const xcoobeeId = user.xcoobee_id;
            const campaigns = await consentsSdk.listCampaigns(overridingConfig);
            const campaignId = campaigns.result.data[0].campaign_cursor;
            const response = await consentsSdk.getCookieConsent(xcoobeeId, campaignId, overridingConfig);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.cookie_consents).toBeDefined();
            const { cookie_consents } = result;
            expect(cookie_consents[ConsentDataTypes.ADVERTISING_COOKIE]).toBe(false);
            expect(cookie_consents[ConsentDataTypes.APPLICATION_COOKIE]).toBe(false);
            expect(cookie_consents[ConsentDataTypes.STATISTICS_COOKIE]).toBe(false);
            expect(cookie_consents[ConsentDataTypes.USAGE_COOKIE]).toBe(false);

            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const xcoobeeId = 'does not matter';
          const campaignId = 'does not matter';

          try {
            await consentsSdk.getCookieConsent(xcoobeeId, campaignId);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.getCookieConsent')

    describe('.listCampaigns', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with the user\'s events', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await consentsSdk.listCampaigns();
            expect(response).toBeInstanceOf(PagingResponse);
            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBeNull();
            expect(result.page_info.has_next_page).toBeNull();
            const campaigns = result.data;
            expect(campaigns).toBeInstanceOf(Array);
            expect(campaigns.length).toBe(1);
            const campaign = campaigns[0];
            expect(campaign).toBeDefined();
            assertIsCursorLike(campaign.campaign_cursor, true);
            expect(campaign.campaign_name).toBe('Test campaign');
            expect(campaign.status).toBe('active');

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

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await consentsSdk.listCampaigns(overridingConfig);
            expect(response).toBeInstanceOf(PagingResponse);
            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBeNull();
            expect(result.page_info.has_next_page).toBeNull();
            const campaigns = result.data;
            expect(campaigns).toBeInstanceOf(Array);
            expect(campaigns.length).toBe(1);
            const campaign = campaigns[0];
            expect(campaign).toBeDefined();
            assertIsCursorLike(campaign.campaign_cursor, true);
            expect(campaign.campaign_name).toBe('Test campaign');
            expect(campaign.status).toBe('active');

            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);

          try {
            await consentsSdk.listCampaigns();
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.listCampaigns')

    describe('.listConsents', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('but no consent status', () => {

          describe('using default config', () => {

            it('should fetch and return with the user\'s consents of any status', async (done) => {
              const defaultConfig = new Config({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });

              const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
              const response = await consentsSdk.listConsents();
              expect(response).toBeInstanceOf(PagingResponse);
              expect(response.hasNextPage()).toBe(false);
              const nextPageResponse = await response.getNextPage();
              expect(nextPageResponse).toBe(null);
              const { result } = response;
              expect(result).toBeDefined();
              expect(result.page_info).toBeDefined();
              expect(result.page_info.end_cursor).toBeNull();
              expect(result.page_info.has_next_page).toBeNull();
              const consents = result.data;
              expect(consents).toBeInstanceOf(Array);
              expect(consents.length).toBeGreaterThan(0);
              const consent = consents[0];
              expect('consent_cursor' in consent).toBe(true);
              assertIsCursorLike(consent.consent_cursor);
              expect('consent_status' in consent).toBe(true);
              expect('date_c' in consent).toBe(true);
              assertIso8601Like(consent.date_c);
              expect('date_e' in consent).toBe(true);
              expect('user_xcoobee_id' in consent).toBe(true);

              done();
            });// eo it

          });// eo describe

          describe('using overriding config', () => {

            it('should fetch and return with the user\'s consents of any status', async (done) => {
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
              expect(response).toBeInstanceOf(PagingResponse);
              expect(response.hasNextPage()).toBe(false);
              const nextPageResponse = await response.getNextPage();
              expect(nextPageResponse).toBe(null);
              const { result } = response;
              expect(result).toBeDefined();
              expect(result.page_info).toBeDefined();
              expect(result.page_info.end_cursor).toBeNull();
              expect(result.page_info.has_next_page).toBeNull();
              const consents = result.data;
              expect(consents).toBeInstanceOf(Array);
              expect(consents.length).toBeGreaterThan(0);
              const consent = consents[0];
              expect('consent_cursor' in consent).toBe(true);
              assertIsCursorLike(consent.consent_cursor);
              expect('consent_status' in consent).toBe(true);
              expect('date_c' in consent).toBe(true);
              assertIso8601Like(consent.date_c);
              expect('date_e' in consent).toBe(true);
              expect('user_xcoobee_id' in consent).toBe(true);

              done();
            });// eo it

          });// eo describe

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const consentStatus = 'does not matter';

          try {
            await consentsSdk.listConsents(consentStatus);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.listConsents')

    describe('.requestConsent', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should succeed and return with given reference', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const xcoobeeId = user.xcoobee_id;
            const campaigns = await consentsSdk.listCampaigns();
            const campaignId = campaigns.result.data[0].campaign_cursor;
            const referenceId = 'asdfasdf';
            const response = await consentsSdk.requestConsent(xcoobeeId, referenceId, campaignId);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.ref_id).toBe(referenceId);

            done();
          });// eo it

        });// eo describe

        describe('using overriding config', () => {

          it('should succeed and return with given reference', async (done) => {
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
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const xcoobeeId = user.xcoobee_id;
            const campaigns = await consentsSdk.listCampaigns(overridingConfig);
            const campaignId = campaigns.result.data[0].campaign_cursor;
            const referenceId = 'asdfasdf';
            const response = await consentsSdk.requestConsent(xcoobeeId, referenceId, campaignId, overridingConfig);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.ref_id).toBe(referenceId);

            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const xcoobeeId = 'does not matter';
          const campaignId = 'does not matter';
          const referenceId = 'does not matter';

          try {
            await consentsSdk.requestConsent(xcoobeeId, campaignId, referenceId);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.requestConsent')

    describe('.setUserDataResponse', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should succeed and return progress report', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const message = 'Here are the files you requested.';
            const consents = await consentsSdk.listConsents();
            const consentId = consents.result.data[0].consent_cursor;
            const referenceId = 'someUniqueReferenceId';
            const file = Path.resolve(__dirname, '..', '..', '..', 'assets', 'user-data.txt');
            const response = await consentsSdk.setUserDataResponse(message, consentId, referenceId, file);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.progress).toBeInstanceOf(Array);
            expect(result.progress.length).toBe(3);
            expect(result.progress[0]).toBe('successfully sent message');
            expect(result.progress[1]).toMatch(/successfully uploaded .*user-data\.txt/);
            expect(result.progress[2]).toBe('successfully sent successfully uploaded file to destination');
            expect(result.ref_id).toBeDefined();

            done();
          });// eo it

        });// eo describe

        describe('using overriding config', () => {

          it('should succeed and return progress report', async (done) => {
            const defaultConfig = new Config({
              apiKey: 'should_be_unused',
              apiSecret: 'should_be_unused',
              apiUrlRoot,
            });
            const overridingConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
            const message = 'Here are the files you requested.';
            const consents = await consentsSdk.listConsents([], overridingConfig);
            const consentId = consents.result.data[0].consent_cursor;
            const referenceId = 'someUniqueReferenceId';
            const file = Path.resolve(__dirname, '..', '..', '..', 'assets', 'user-data.dat');
            const response = await consentsSdk.setUserDataResponse(message, consentId, referenceId, file, overridingConfig);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.progress).toBeInstanceOf(Array);
            expect(result.progress.length).toBe(3);
            expect(result.progress[0]).toBe('successfully sent message');
            expect(result.progress[1]).toMatch(/successfully uploaded .*user-data\.dat/);
            expect(result.progress[2]).toBe('successfully sent successfully uploaded file to destination');
            expect(result.ref_id).toBeDefined();

            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should return with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const consentsSdk = new Consents(defaultConfig, apiAccessTokenCache, usersCache);
          const message = 'does not matter';
          const consentId = 'does not matter';
          const referenceId = 'does not matter';
          const file = null;

          try {
            await consentsSdk.setUserDataResponse(message, consentId, referenceId, file);
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.setUserDataResponse')

  });// eo describe('instance')

});// eo describe('Consents')
