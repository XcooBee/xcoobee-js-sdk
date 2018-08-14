import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import EventsApi from '../../../../../src/xcoobee/api/EventsApi';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

// import { assertIsCursorLike } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.getEvents', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known user ID', function () {

        it('should return the user\'s events', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = user.cursor;
          const events = await EventsApi.getEvents(apiUrlRoot, apiAccessToken, userCursor);
          expect(events).toBeInstanceOf(Array);
          // Not yet sure if this will always be the case, but it is right now.
          expect(events.length).toBe(0);
          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown user ID', function () {

        it('should return with no data', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = 'unknown';
          try {
            await EventsApi.getEvents(apiUrlRoot, apiAccessToken, userCursor);
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

  });// eo describe('.getEvents')

});// eo describe('EventsApi')
