import ConversationsApi from '../../../../../src/xcoobee/api/ConversationsApi';
import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';
import UsersCache from '../../../../../src/xcoobee/sdk/UsersCache';

import { assertIsCursorLike } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConversationsApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  xdescribe('.getConversation', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with user info', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const targetCursor = 'known'; // FIXME: TODO: Get a legit target cursor.
        const conversations = await ConversationsApi.getConversation(apiUrlRoot, apiAccessToken, targetCursor);
        // TODO: Find a way to get conversations back.
        expect(conversations).toBeInstanceOf(Array);
        expect(conversations.length).toBe(0);
        // let conversation = conversations[0];
        // expect('consent_cursor' in conversation).toBe(true);
        // assertIsCursorLike(conversation.consent_cursor);
        // expect('date_c' in conversation).toBe(true);
        // assertIso8601Like(conversation.date_c)
        // expect('display_name' in conversation).toBe(true);
        // expect('note_text' in conversation).toBe(true);
        // expect('target_cursor' in conversation).toBe(true);
        // assertIsCursorLike(conversation.target_cursor);
        done();
      });// eo it

    });// eo describe

  });// eo describe('.getConversations')

  describe('.getConversations', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with user info', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const conversations = await ConversationsApi.getConversations(apiUrlRoot, apiAccessToken, userCursor);
        // TODO: Find a way to get conversations back.
        expect(conversations).toBeInstanceOf(Array);
        expect(conversations.length).toBe(0);
        // let conversation = conversations[0];
        // expect('consent_cursor' in conversation).toBe(true);
        // assertIsCursorLike(conversation.consent_cursor);
        // expect('date_c' in conversation).toBe(true);
        // assertIso8601Like(conversation.date_c)
        // expect('display_name' in conversation).toBe(true);
        // expect('note_text' in conversation).toBe(true);
        // expect('target_cursor' in conversation).toBe(true);
        // assertIsCursorLike(conversation.target_cursor);
        done();
      });// eo it

    });// eo describe

  });// eo describe('.getConversations')

});// eo describe('ConversationsApi')
