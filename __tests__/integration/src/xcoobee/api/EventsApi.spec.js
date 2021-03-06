const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const EventsApi = require('../../../../../src/xcoobee/api/EventsApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EventsApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.getEvents', () => {

    describe('called with a valid API access token', () => {

      describe('and called with a known user ID', () => {

        it('should return the user\'s events', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = user.cursor;
          const eventsPage = await EventsApi.getEvents(apiUrlRoot, apiAccessToken, userCursor);
          expect(eventsPage).toBeDefined();
          expect(eventsPage.data).toBeInstanceOf(Array);
          // Not yet sure if this will always be the case, but it is right now.
          expect(eventsPage.data.length).toBe(0);
          expect(eventsPage.page_info).toBeDefined();
          expect(eventsPage.page_info.end_cursor).toBe(null);
          expect(eventsPage.page_info.has_next_page).toBe(null);

          done();
        });// eo it

      });// eo describe

      describe('and called with an unknown user ID', () => {

        it('should return with no data', async (done) => {
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
