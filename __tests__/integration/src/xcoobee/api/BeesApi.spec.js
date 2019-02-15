const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const BeesApi = require('../../../../../src/xcoobee/api/BeesApi');

const { findBeesBySystemName } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('BeesApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.bees', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with a list of bees', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const result = await BeesApi.bees(apiUrlRoot, apiAccessToken, '');
        expect(result).toBeDefined();
        expect(result.data).toBeInstanceOf(Array);
        expect(result.page_info).toBeDefined();
        expect(result.page_info.has_next_page).toBe(false);
        const bees = result.data;
        expect(bees).toBeInstanceOf(Array);

        let filteredBees = findBeesBySystemName(bees, 'xcoobee_bee_watermark');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_bee_watermark');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_dropbox_uploader');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_dropbox_uploader');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_google_drive_uploader');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_google_drive_uploader');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_imgur');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_imgur');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_message');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_message');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_onedrive_uploader');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_onedrive_uploader');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_send_contact');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_send_contact');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_send_consent_request');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_send_consent_request');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_timestamp');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_timestamp');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_twitter');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_twitter');

        done();
      });// eo it

    });// eo describe

  });// eo describe('.bees')

});// eo describe('BeesApi')
