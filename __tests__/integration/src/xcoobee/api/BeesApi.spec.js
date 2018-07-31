import BeesApi from '../../../../../src/xcoobee/api/BeesApi';
import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
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
        expect(bees.length).toBe(0);
        // TODO: Add more expectations.
        done();
      });// eo it

    });// eo describe

  });// eo describe('.bees')

});// eo describe('BeesApi')
