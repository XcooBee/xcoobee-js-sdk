import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import UsersApi from '../../../../../src/xcoobee/api/UsersApi';

import { assertIsCursorLike } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('UsersApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.getUser', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with user info', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const userInfo = await UsersApi.getUser(apiUrlRoot, apiAccessToken, '');
        expect(userInfo).toBeDefined();
        expect('cursor' in userInfo).toBe(true);
        assertIsCursorLike(userInfo.cursor);
        expect('pgp_public_key' in userInfo).toBe(true);
        expect('xcoobee_id' in userInfo).toBe(true);
        done();
      });// eo it

    });// eo describe

  });// eo describe('.getUser')

});// eo describe('UsersApi')
