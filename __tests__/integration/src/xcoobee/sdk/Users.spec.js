import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import Config from '../../../../../src/xcoobee/sdk/Config';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';
import Users from '../../../../../src/xcoobee/sdk/Users';

import { assertIsCursorLike, assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Users', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    describe('.getConversation', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s conversations', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const targetCursor = 'CTZamTgKRkN8LMb/AtKR8d72P4v/k5bkI7ynikFlf1QFL0ybh8ZvKR6MAb4KJDIL1v6aAA==';
            const response = await usersSdk.getConversation(targetCursor);
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const conversations = response.results;
            expect(conversations).toBeInstanceOf(Array);
            expect(conversations.length).toBeGreaterThan(1);
            let conversation = conversations[0];
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

      });// eo describe

    });// eo describe('.getConversation')

    describe('.getConversations', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s conversations', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await usersSdk.getConversations();
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const conversationsPage = response.results;
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

      });// eo describe

    });// eo describe('.getConversations')

    describe('.getUser', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s information', async function (done) {
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

        describe('using overriding config', function () {

          it('should fetch and return with the user\'s information', async function (done) {
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

      describe('called with an invalid API key/secret pair', function () {

        it('should return with an error response', async function (done) {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
          const response = await usersSdk.getUser();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.getUser')

    xdescribe('.sendUserMessage', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should send a message', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const message = 'Testing. 1, 2, 3!';
            const consentId = 'known'; // FIXME: TODO: Get a legit consent ID.
            const response = await usersSdk.sendUserMessage(message, consentId);
            expect(response).toBeInstanceOf(SuccessResponse);
            const note = response.result.data;
            expect(note).toBeDefined();
            expect(note.note_text).toBe('Testing. 1, 2, 3!');
            assertIsCursorLike(note.target_cursor);
            expect(note.xcoobee_id).toBe('');

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.sendUserMessage')

  });// eo describe('instance')

});// eo describe('Users')
