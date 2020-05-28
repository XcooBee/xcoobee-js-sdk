const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const ConversationsApi = require('../../../../../src/xcoobee/api/ConversationsApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ConversationsApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.getConversation', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with conversations', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const conversations = await ConversationsApi.getConversations(apiUrlRoot, apiAccessToken, userCursor);
        const targetCursor = conversations.data[0].target_cursor;
        const conversationsPage = await ConversationsApi.getConversation(apiUrlRoot, apiAccessToken, targetCursor);
        expect(conversationsPage).toBeDefined();
        expect(conversationsPage.data).toBeInstanceOf(Array);
        expect(conversationsPage.data.length).toBeGreaterThan(0);
        const conversation = conversationsPage.data[0];
        expect('reference_cursor' in conversation).toBe(true);
        assertIsCursorLike(conversation.reference_cursor, true);
        expect('date_c' in conversation).toBe(true);
        assertIso8601Like(conversation.date_c);
        expect('date_e' in conversation).toBe(true);
        expect('display_city' in conversation).toBe(true);
        expect('display_country' in conversation).toBe(true);
        expect('display_name' in conversation).toBe(true);
        expect('display_province' in conversation).toBe(true);
        expect('is_outbound' in conversation).toBe(true);
        expect('note_text' in conversation).toBe(true);
        expect(conversation.note_text).toBe('Test Message. Message added by XcooBee system for developer accounts.');
        expect(conversation.note_type).toBe('consent');
        expect('photo_url' in conversation).toBe(true);
        expect('xcoobee_id' in conversation).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getConversation')

  describe('.getConversations', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with conversations', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const conversationsPage = await ConversationsApi.getConversations(apiUrlRoot, apiAccessToken, userCursor);
        expect(conversationsPage).toBeDefined();
        expect(conversationsPage.data).toBeInstanceOf(Array);
        expect(conversationsPage.data.length).toBe(1);
        const conversation = conversationsPage.data[0];
        expect('date_c' in conversation).toBe(true);
        assertIso8601Like(conversation.date_c);
        expect(conversation.note_type).toBe('consent');
        expect('target_cursor' in conversation).toBe(true);
        assertIsCursorLike(conversation.target_cursor);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getConversations')

});// eo describe('ConversationsApi')
