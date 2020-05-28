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
        const bees = result.data;

        expect(bees).toBeInstanceOf(Array);

        const filteredBees = findBeesBySystemName(bees, 'xcoobee_bee_watermark');
        expect(filteredBees.length).toBe(1);
        expect(filteredBees[0].bee_system_name).toBe('xcoobee_bee_watermark');

        done();
      });// eo it

    });// eo describe

  });// eo describe('.bees')

});// eo describe('BeesApi')
