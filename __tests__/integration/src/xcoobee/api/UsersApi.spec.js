const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const UsersApi = require('../../../../../src/xcoobee/api/UsersApi');

const { assertIsCursorLike } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('UsersApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.getUser', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with user info', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const userInfo = await UsersApi.getUser(apiUrlRoot, apiAccessToken);
        expect(userInfo).toBeDefined();
        expect('cursor' in userInfo).toBe(true);
        assertIsCursorLike(userInfo.cursor);
        expect('xcoobee_id' in userInfo).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getUser')

});// eo describe('UsersApi')
