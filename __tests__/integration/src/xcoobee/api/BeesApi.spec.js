import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import BeesApi from '../../../../../src/xcoobee/api/BeesApi';

import { findBeesBySystemName } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('BeesApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.bees', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with a list of bees', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const bees = await BeesApi.bees(apiUrlRoot, apiAccessToken, '');
        expect(bees).toBeInstanceOf(Array);
        expect(bees.length).toBe(7);

        let filteredBees = findBeesBySystemName(bees, 'xcoobee_bee_watermark');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_bee_watermark');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_dropbox_uploader');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_dropbox_uploader');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_google_drive_uploader');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_google_drive_uploader');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_onedrive_uploader');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_onedrive_uploader');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_twitter');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_twitter');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_send_contact_card');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_send_contact_card');

        filteredBees = findBeesBySystemName(bees, 'xcoobee_send_consent_request');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_send_consent_request');

        done();
      });// eo it

    });// eo describe

  });// eo describe('.bees')

});// eo describe('BeesApi')
