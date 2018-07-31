import EndPointApi from '../../../../../src/xcoobee/api/EndPointApi';
import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';
import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';
import UsersCache from '../../../../../src/xcoobee/sdk/UsersCache';

import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EndPointApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.outbox_endpoints', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known user ID', function () {

        it('should return the user\'s outbox endpoints', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = user.cursor;
          const endPoints = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
          expect(endPoints).toBeInstanceOf(Array);
          // Not yet sure if this will always be the case, but it is right now.
          expect(endPoints.length).toBe(1);
          const endPoint = endPoints[0];
          expect('cursor' in endPoint).toBe(true);
          assertIsCursorLike(endPoint.cursor);
          expect('date_c' in endPoint).toBe(true);
          assertIso8601Like(endPoint.date_c)
          expect('name' in endPoint).toBe(true);
          expect(endPoint.name).toBe('flex');
          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown user ID', function () {

        it('should return with no data', async function (done) {
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
