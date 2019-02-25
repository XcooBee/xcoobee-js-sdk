const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const EndPointApi = require('../../../../../src/xcoobee/api/EndPointApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EndPointApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.outbox_endpoints', () => {

    describe('called with a valid API access token', () => {

      describe('and called with a known user ID', () => {

        it('should return the user\'s outbox endpoints', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = user.cursor;
          const result = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
          expect(result).toBeDefined();
          const { data, page_info } = result;
          expect(page_info).toBe(null);
          // expect(page_info.end_cursor).toBeDefined();
          // expect(page_info.has_next_page).toBe(false);
          expect(data).toBeDefined();
          const endPoints = data;
          expect(endPoints).toBeInstanceOf(Array);
          // Not yet sure if this will always be the case, but it is right now.
          expect(endPoints.length).toBe(1);
          const endPoint = endPoints[0];
          expect('cursor' in endPoint).toBe(true);
          assertIsCursorLike(endPoint.cursor);
          expect('date_c' in endPoint).toBe(true);
          assertIso8601Like(endPoint.date_c);
          expect('name' in endPoint).toBe(true);
          expect(endPoint.name).toBe('flex');
          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown user ID', () => {

        it('should return with no data', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = 'unknown';
          try {
            await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
            // This should not be called.
            expect(true).toBe(false);
          } catch (err) {
            expect(err).toBeInstanceOf(XcooBeeError);
            expect(err.message).toBe('Wrong key at line: 3, column: 7');
            expect(err.name).toBe('XcooBeeError');
            done();
          }
        });// eo it

      });// eo describe

    });// eo describe

  });// eo describe('.outbox_endpoints')

});// eo describe('EndPointApi')
