const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const ConsentsApi = require('../../../../../src/xcoobee/api/ConsentsApi');
const ConsentDataTypes = require('../../../../../src/xcoobee/api/ConsentDataTypes');
const ConsentStatuses = require('../../../../../src/xcoobee/api/ConsentStatuses');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConsentsApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  xdescribe('.confirmConsentChange', () => {

    describe('called with a valid API access token', () => {

      it('should return flag indicating if the consent change has been confirmed', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const consentCursor = 'known'; // FIXME: TODO: Get a legit consent cursor.
        const result = await ConsentsApi.confirmConsentChange(apiUrlRoot, apiAccessToken, consentCursor);
        expect(result).toBeDefined();
        expect(result.confirmed).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.confirmConsentChange')

  xdescribe('.confirmDataDelete', () => {

    describe('called with a valid API access token', () => {

      it('should return flag indicating if the data has been deleted/purged', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const consentCursor = 'known'; // FIXME: TODO: Get a legit consent cursor.
        const result = await ConsentsApi.confirmDataDelete(apiUrlRoot, apiAccessToken, consentCursor);
        expect(result).toBeDefined();
        expect(result.confirmed).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.confirmDataDelete')

  describe('.getCookieConsent', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with cookie consent info', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const xcoobeeId = '~SDKTester_Developer';
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
        const result = await ConsentsApi.getCookieConsent(
          apiUrlRoot, apiAccessToken, xcoobeeId, userCursor, campaignId
        );
        expect(result).toBeDefined();
        expect(result.cookie_consents).toBeDefined();
        const { cookie_consents } = result;
        expect(typeof cookie_consents[ConsentDataTypes.ADVERTISING_COOKIE]).toBe('boolean');
        expect(typeof cookie_consents[ConsentDataTypes.APPLICATION_COOKIE]).toBe('boolean');
        expect(typeof cookie_consents[ConsentDataTypes.STATISTICS_COOKIE]).toBe('boolean');
        expect(typeof cookie_consents[ConsentDataTypes.USAGE_COOKIE]).toBe('boolean');

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getCookieConsent')

  xdescribe('.getConsentData', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with consent info', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const consentCursor = 'known'; // FIXME: TODO: Get a legit consent cursor.
        const result = await ConsentsApi.getConsentData(apiUrlRoot, apiAccessToken, consentCursor);
        expect(result).toBeDefined();
        const { consent } = result;
        expect(consent).toBeDefined();
        // expect('consent_description' in consent).toBe(true);
        // expect('consent_details' in consent).toBe(true);
        // expect('datatype' in consent.consent_details).toBe(true);
        // expect('consent_name' in consent).toBe(true);
        // expect('consent_status' in consent).toBe(true);
        // expect('consent_type' in consent).toBe(true);
        // expect('date_c' in consent).toBe(true);
        // assertIso8601Like(consent.date_c)
        // expect('date_e' in consent).toBe(true);
        // assertIso8601Like(consent.date_e)
        // expect(consent.request_data_types).toBeInstanceOf(Array);
        // expect(consent.request_data_types.length).toBe(0)
        // expect('request_owner' in consent).toBe(true);
        // expect(consent.required_data_types).toBeInstanceOf(Array);
        // expect(consent.required_data_types.length).toBe(0)
        // expect('user_cursor' in consent).toBe(true);
        // assertIsCursorLike(consent.user_cursor);
        // expect('user_display_name' in consent).toBe(true);
        // expect('user_xcoobee_id' in consent).toBe(true);
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
            expect(consents.length).toBe(100);
            // expect(consents.length).toBeGreaterThan(0);
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

        describe('and active consent status', () => {

          it('should fetch and return with the user\'s active consents', async (done) => {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const userCursor = user.cursor;
            const result = await ConsentsApi.listConsents(
              apiUrlRoot, apiAccessToken, userCursor, [ConsentStatuses.ACTIVE]
            );
            // TODO: Find a way to get consents back.
            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBe(null);
            expect(result.page_info.has_next_page).toBe(null);
            const consents = result.data;
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

        // TODO: Test with various consent statuses.
      });// eo describe

    });// eo describe

  });// eo describe('.listConsents')

  describe('.requestConsent', () => {

    describe('called with a valid API access token', () => {

      it('should succeed and return with given reference', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const xcoobeeId = '~SDKTester_Developer';
        const campaignId = 'CTZamTgKRBUqJsavV4+R8NnwaIv/mcLqI+enjUFlcARTKRidhcY4K0rbAb4KJDIL1uaaAA==';
        const referenceId = 'asdfasdf';
        const result = await ConsentsApi.requestConsent(
          apiUrlRoot, apiAccessToken, xcoobeeId, campaignId, referenceId
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
        const consentCursor = 'CTZamTgKFkJyf5ujU9yR9NT2Pov/z8C+I+SmiUxlIQQCc0yY0ctiLxrbAb4KJDIL1uiaAA==';
        const xcoobeeId = await ConsentsApi.resolveXcoobeeId(
          apiUrlRoot, apiAccessToken, consentCursor
        );
        expect(xcoobeeId).toBe('~SDKTester_Developer');

        done();
      });// eo it

    });// eo describe

  });// eo describe('.resolveXcoobeeId')

});// eo describe('ConsentsApi')
