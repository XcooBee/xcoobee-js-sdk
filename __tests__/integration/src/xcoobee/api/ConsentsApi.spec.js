import ConsentsApi from '../../../../../src/xcoobee/api/ConsentsApi';
import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';

import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConsentsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  xdescribe('.getConsentData', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with user info', async function (done) {
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

  });// eo describe('.getConsentDatas')

});// eo describe('ConsentsApi')
