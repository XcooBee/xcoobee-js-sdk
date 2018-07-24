import EventsApi from '../../../../../src/xcoobee/api/EventsApi';
import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';
import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';
import UsersCache from '../../../../../src/xcoobee/sdk/UsersCache';

import { assertIsCursorLike } from '../../../../lib/Utils';

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
          const apiAccessToken = await apiAccessTokenCache.get(apiKey, apiSecret);
          const user = await usersCache.get(apiKey, apiSecret);
          const userCursor = user.cursor;
          const events = await EventsApi.getEvents(apiAccessToken, userCursor);
          expect(events).toBeInstanceOf(Array);
          // Not yet sure if this will always be the case, but it is right now.
          expect(events.length).toBe(0);
          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown user ID', function () {

        it('should return with no data', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiKey, apiSecret);
          const userCursor = 'unknown';
          try {
            await EventsApi.getEvents(apiAccessToken, userCursor);
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
