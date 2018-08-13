import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import ConsentsApi from '../../../../../src/xcoobee/api/ConsentsApi';
import CookieDataTypes from '../../../../../src/xcoobee/api/ConsentDataTypes';
import ConsentStatuses from '../../../../../src/xcoobee/api/ConsentStatuses';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

// import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConsentsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  xdescribe('.getCookieConsent', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with consent info', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const xcoobeeId = '~SDK_Tester';
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const campaignId = 'known'; // FIXME: TODO: Get a legit campaign ID.
        const cookieConsents = await ConsentsApi.getCookieConsent(
          apiUrlRoot, apiAccessToken, xcoobeeId, userCursor, campaignId
        );
        expect(cookieConsents).toBeDefined();
        expect(typeof cookieConsents[CookieDataTypes.ADVERTISING_COOKIE]).toBe('boolean');
        expect(typeof cookieConsents[CookieDataTypes.APPLICATION_COOKIE]).toBe('boolean');
        expect(typeof cookieConsents[CookieDataTypes.STATISTICS_COOKIE]).toBe('boolean');
        expect(typeof cookieConsents[CookieDataTypes.USAGE_COOKIE]).toBe('boolean');
        done();
      });// eo it

    });// eo describe

  });// eo describe('.getCookieConsent')

  xdescribe('.getConsentData', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with consent info', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const consentCursor = 'known'; // FIXME: TODO: Get a legit consent cursor.
        const consent = await ConsentsApi.getConsentData(apiUrlRoot, apiAccessToken, consentCursor);
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

  describe('.listConsents', function () {

    describe('called with a valid API access token', function () {

      describe('and a valid user cursor', function () {

        describe('but no consent status', function () {

          it('should fetch and return with the user\'s consents of any status', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const userCursor = user.cursor;
            const consents = await ConsentsApi.listConsents(apiUrlRoot, apiAccessToken, userCursor);
            // TODO: Find a way to get conversations back.
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

        describe('and active consent status', function () {

          it('should fetch and return with the user\'s active consents', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const userCursor = user.cursor;
            const consents = await ConsentsApi.listConsents(
              apiUrlRoot, apiAccessToken, userCursor, ConsentStatuses.ACTIVE
            );
            // TODO: Find a way to get conversations back.
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

});// eo describe('ConsentsApi')
