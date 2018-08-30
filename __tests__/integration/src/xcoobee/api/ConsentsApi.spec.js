import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import ConsentsApi from '../../../../../src/xcoobee/api/ConsentsApi';
import ConsentDataTypes from '../../../../../src/xcoobee/api/ConsentDataTypes';
import ConsentStatuses from '../../../../../src/xcoobee/api/ConsentStatuses';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConsentsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  xdescribe('.confirmConsentChange', function () {

    describe('called with a valid API access token', function () {

      it('should return flag indicating if the consent change has been confirmed', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const consentCursor = 'known'; // FIXME: TODO: Get a legit consent cursor.
        const result = await ConsentsApi.confirmConsentChange(apiUrlRoot, apiAccessToken, consentCursor);
        expect(result).toBeDefined();
        expect(result.confirmed).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.confirmConsentChange')

  xdescribe('.confirmDataDelete', function () {

    describe('called with a valid API access token', function () {

      it('should return flag indicating if the data has been deleted/purged', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const consentCursor = 'known'; // FIXME: TODO: Get a legit consent cursor.
        const result = await ConsentsApi.confirmDataDelete(apiUrlRoot, apiAccessToken, consentCursor);
        expect(result).toBeDefined();
        expect(result.confirmed).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.confirmDataDelete')

  describe('.getCookieConsent', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with cookie consent info', async function (done) {
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

  xdescribe('.getConsentData', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with consent info', async function (done) {
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

  describe('.listConsents', function () {

    describe('called with a valid API access token', function () {

      describe('and a valid user cursor', function () {

        describe('but no consent status', function () {

          it('should fetch and return with the user\'s consents of any status', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const userCursor = user.cursor;
            const result = await ConsentsApi.listConsents(apiUrlRoot, apiAccessToken, userCursor);
            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBe('KGyAdqa9//owg9NvMGdRlTNrkAet748qYDRsNXhLtGlgWL3mfZw7DvGY6+UkKSNSLCg+ATVIT3iaOmj+eJ13SkFPOZlm9zjOaFeADKhGYZ8OloFX');
            expect(result.page_info.has_next_page).toBeNull();
            const consents = result.data;
            expect(consents).toBeInstanceOf(Array);
            expect(consents.length).toBeGreaterThan(0);
            let consent = consents[0];
            expect('consent_cursor' in consent).toBe(true);
            assertIsCursorLike(consent.consent_cursor);
            expect('consent_status' in consent).toBe(true);
            expect('date_c' in consent).toBe(true);
            assertIso8601Like(consent.date_c)
            expect('date_e' in consent).toBe(true);
            assertIso8601Like(consent.date_e)
            expect('user_xcoobee_id' in consent).toBe(true);

            done();
          });// eo it

        });// eo describe

        describe('and active consent status', function () {

          it('should fetch and return with the user\'s active consents', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const userCursor = user.cursor;
            const result = await ConsentsApi.listConsents(
              apiUrlRoot, apiAccessToken, userCursor, ConsentStatuses.ACTIVE
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

  describe('.requestConsent', function () {

    describe('called with a valid API access token', function () {

      it('should succeed and return with given reference', async function (done) {
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

  describe('.resolveXcoobeeId', function () {

    describe('called with a valid API access token', function () {

      it('should succeed and return with given reference', async function (done) {
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
