import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import ConversationsApi from '../../../../../src/xcoobee/api/ConversationsApi';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConversationsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.getConversation', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with conversations', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const targetCursor = 'CTZamTgKRkN8LMb/AtKR8d72P4v/k5bkI7ynikFlf1QFL0ybh8ZvKR6MAb4KJDIL1v6aAA==';
        const conversationsPage = await ConversationsApi.getConversation(apiUrlRoot, apiAccessToken, targetCursor);
        expect(conversationsPage).toBeDefined();
        expect(conversationsPage.data).toBeInstanceOf(Array);
        expect(conversationsPage.data.length).toBeGreaterThan(1);
        let conversation = conversationsPage.data[0];
        expect('breach_cursor' in conversation).toBe(true);
        assertIsCursorLike(conversation.breach_cursor, true);
        expect('consent_cursor' in conversation).toBe(true);
        assertIsCursorLike(conversation.consent_cursor);
        expect('date_c' in conversation).toBe(true);
        assertIso8601Like(conversation.date_c)
        expect('date_e' in conversation).toBe(true);
        assertIso8601Like(conversation.date_e, true)
        expect('display_city' in conversation).toBe(true);
        expect('display_country' in conversation).toBe(true);
        expect('display_name' in conversation).toBe(true);
        expect('display_province' in conversation).toBe(true);
        expect('is_outbound' in conversation).toBe(true);
        expect('note_text' in conversation).toBe(true);
        expect(conversation.note_type).toBe('consent');
        expect('photo_url' in conversation).toBe(true);
        expect('xcoobee_id' in conversation).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getConversation')

  describe('.getConversations', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with conversations', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const conversationsPage = await ConversationsApi.getConversations(apiUrlRoot, apiAccessToken, userCursor);
        expect(conversationsPage).toBeDefined();
        expect(conversationsPage.data).toBeInstanceOf(Array);
        expect(conversationsPage.data.length).toBe(1);
        let conversation = conversationsPage.data[0];
        expect('date_c' in conversation).toBe(true);
        assertIso8601Like(conversation.date_c)
        expect(conversation.display_name).toBe('SDKTester Developer');
        expect(conversation.note_type).toBe('consent');
        expect('target_cursor' in conversation).toBe(true);
        assertIsCursorLike(conversation.target_cursor);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getConversations')

  xdescribe('.sendUserMessage', function () {

    describe('called with a valid API access token', function () {

      it('should create, send, and return a note', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const message = 'Testing. 1, 2, 3!';
        const userCursor = user.cursor;
        const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
        const note = await ConversationsApi.sendUserMessage(apiUrlRoot, apiAccessToken, message, userCursor, consentId);
        expect(note).toBeDefined();
        expect(note.note_text).toBe('Testing. 1, 2, 3!');
        assertIsCursorLike(note.target_cursor);
        expect(note.xcoobee_id).toBe('');

        done();
      });// eo it

      // TODO: Test with a breach ID.
    });// eo describe

  });// eo describe('.sendUserMessage')

});// eo describe('ConversationsApi')
