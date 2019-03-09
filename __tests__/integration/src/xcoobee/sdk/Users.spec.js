const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const Config = require('../../../../../src/xcoobee/sdk/Config');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');
const Users = require('../../../../../src/xcoobee/sdk/Users');

const { assertIsCursorLike, assertIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Users', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', () => {

    describe('.getConversation', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with the user\'s conversations', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const conversations = await usersSdk.getConversations();
            const targetCursor = conversations.result.data[0].target_cursor;
            const response = await usersSdk.getConversation(targetCursor);
            expect(response).toBeInstanceOf(PagingResponse);
            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBeNull();
            expect(result.page_info.has_next_page).toBeNull();
            const messages = result.data;
            expect(messages).toBeInstanceOf(Array);
            expect(messages.length).toBeGreaterThan(0);
            const conversation = messages[0];
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
            expect(conversation.note_text).toBe('test message for test consent');
            expect(conversation.note_type).toBe('consent');
            expect('photo_url' in conversation).toBe(true);
            expect('xcoobee_id' in conversation).toBe(true);

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.getConversation')

    describe('.getConversations', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with the user\'s conversations', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await usersSdk.getConversations();
            expect(response).toBeInstanceOf(PagingResponse);
            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.page_info).toBeDefined();
            expect(result.page_info.end_cursor).toBeNull();
            expect(result.page_info.has_next_page).toBeNull();
            const conversations = result.data;
            expect(conversations).toBeInstanceOf(Array);
            expect(conversations.length).toBe(1);
            const conversation = conversations[0];
            expect('date_c' in conversation).toBe(true);
            assertIso8601Like(conversation.date_c);
            expect(conversation.note_type).toBe('consent');
            expect('target_cursor' in conversation).toBe(true);
            assertIsCursorLike(conversation.target_cursor);

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.getConversations')

    describe('.getUser', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with the user\'s information', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await usersSdk.getUser();
            expect(response).toBeInstanceOf(SuccessResponse);
            const userInfo = response.result.data;
            expect('cursor' in userInfo).toBe(true);
            assertIsCursorLike(userInfo.cursor);
            expect('pgp_public_key' in userInfo).toBe(true);
            expect('xcoobee_id' in userInfo).toBe(true);
            done();
          });// eo it

        });// eo describe

        describe('using overriding config', () => {

          it('should fetch and return with the user\'s information', async (done) => {
            const defaultConfig = new Config({
              apiKey: 'should_be_unused',
              apiSecret: 'should_be_unused',
              apiUrlRoot: 'should_be_unused',
            });
            const overridingConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await usersSdk.getUser(overridingConfig);
            expect(response).toBeInstanceOf(SuccessResponse);
            const userInfo = response.result.data;
            expect('cursor' in userInfo).toBe(true);
            assertIsCursorLike(userInfo.cursor);
            expect('pgp_public_key' in userInfo).toBe(true);
            expect('xcoobee_id' in userInfo).toBe(true);
            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should reject with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);

          try {
            await usersSdk.getUser();
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('Unable to get an API access token.');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.getUser')

    describe('.sendUserMessage', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should send a message', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const message = 'Testing. 1, 2, 3!';
            const conversations = await usersSdk.getConversations();
            const targetCursor = conversations.result.data[0].target_cursor;
            const conversation = await usersSdk.getConversation(targetCursor);
            const consentId = conversation.result.data[0].reference_cursor;
            const response = await usersSdk.sendUserMessage(message, { consentId });
            expect(response).toBeInstanceOf(SuccessResponse);
            const note = response.result.data;
            expect(note).toBeDefined();
            expect(note.note_text).toBe('Testing. 1, 2, 3!');

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.sendUserMessage')

  });// eo describe('instance')

});// eo describe('Users')
