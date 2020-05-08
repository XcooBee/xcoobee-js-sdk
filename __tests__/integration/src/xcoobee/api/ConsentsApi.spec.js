const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const ConsentsApi = require('../../../../../src/xcoobee/api/ConsentsApi');
const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');
const ConsentDataTypes = require('../../../../../src/xcoobee/api/ConsentDataTypes');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');
const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');
const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConsentsApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.getCookieConsent', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with cookie consent info', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const xcoobeeId = user.xcoobee_id;
        const campaigns = await CampaignApi.getCampaigns(apiUrlRoot, apiAccessToken, userCursor);
        const campaignCursor = campaigns.data[0].campaign_cursor;
        const result = await ConsentsApi.getCookieConsent(
          apiUrlRoot, apiAccessToken, xcoobeeId, userCursor, campaignCursor
        );
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

  });// eo describe('.getCookieConsent')

  describe('.getConsentData', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with consent info', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const consents = await ConsentsApi.listConsents(apiUrlRoot, apiAccessToken, userCursor);
        const consentCursor = consents.data[0].consent_cursor;
        const result = await ConsentsApi.getConsentData(apiUrlRoot, apiAccessToken, consentCursor);
        expect(result).toBeDefined();
        const { consent } = result;
        expect(consent).toBeDefined();
        expect(consent.consent_description).toBe('Test campaign description');
        expect('consent_details' in consent).toBe(true);
        expect('consent_name' in consent).toBe(true);
        expect('consent_status' in consent).toBe(true);
        expect('consent_type' in consent).toBe(true);
        expect('date_c' in consent).toBe(true);
        assertIso8601Like(consent.date_c);
        expect('date_e' in consent).toBe(true);
        expect(consent.request_data_types).toBeInstanceOf(Array);
        expect('request_owner' in consent).toBe(true);
        expect(consent.required_data_types).toBeInstanceOf(Array);
        expect('user_cursor' in consent).toBe(true);
        assertIsCursorLike(consent.user_cursor);
        expect('user_display_name' in consent).toBe(true);
        expect(consent.user_xcoobee_id).toBe(user.xcoobee_id);
        done();
      });// eo it

    });// eo describe

  });// eo describe('.getConsentData')

  describe('.listConsents', () => {

    describe('called with a valid API access token', () => {

      describe('and a valid user cursor', () => {

        describe('but no consent status', () => {

          it('should fetch and return with the user\'s consents of any status', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const userCursor = user.cursor;
            const result = await ConsentsApi.listConsents(apiUrlRoot, apiAccessToken, userCursor);
            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
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
            expect(consent.user_xcoobee_id).toBe(user.xcoobee_id);

            done();
          });// eo it

        });// eo describe

        // TODO: Test with various consent statuses.
      });// eo describe

    });// eo describe

  });// eo describe('.listConsents')

  describe('.requestConsent', () => {

    describe('called with a valid API access token', () => {

      it('should succeed and return with given reference', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const xcoobeeId = user.xcoobee_id;
        const campaigns = await CampaignApi.getCampaigns(apiUrlRoot, apiAccessToken, userCursor);
        const campaignCursor = campaigns.data[0].campaign_cursor;
        const referenceId = 'asdfasdf';
        const result = await ConsentsApi.requestConsent(
          apiUrlRoot, apiAccessToken, xcoobeeId, campaignCursor, referenceId
        );
        expect(result).toBeDefined();
        expect(result.ref_id).toBe(referenceId);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.requestConsent')

  describe('.resolveXcoobeeId', () => {

    describe('called with a valid API access token', () => {

      it('should succeed and return with given reference', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const consents = await ConsentsApi.listConsents(apiUrlRoot, apiAccessToken, userCursor);
        const consentCursor = consents.data[0].consent_cursor;
        const xcoobeeId = await ConsentsApi.resolveXcoobeeId(
          apiUrlRoot, apiAccessToken, consentCursor
        );

        expect(xcoobeeId).toBe(user.xcoobee_id);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.resolveXcoobeeId')

  describe('.setUserDataResponse', () => {

    describe('called with a valid API access token', () => {

      it('should return error if no data request found', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        try {
          await ConsentsApi.setUserDataResponse(apiUrlRoot, apiAccessToken, 'message', 'requestRef', 'test.txt');
        } catch (err) {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Data request not found at line: 3, column: 7');
        }

        done();
      });// eo it

    });// eo describe

  });// eo describe('.setUserDataResponse')

});// eo describe('ConsentsApi')
