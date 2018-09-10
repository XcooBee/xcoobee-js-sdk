import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import Config from '../../../../../src/xcoobee/sdk/Config';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import Inbox from '../../../../../src/xcoobee/sdk/Inbox';
import PagingResponse from '../../../../../src/xcoobee/sdk/PagingResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';

import { assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Inbox', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    describe('.deleteInboxItem', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('and a valid user cursor', function () {

          describe('but with an unknown message ID', function () {

            describe('using default config', function () {

              it('should return with a null transaction ID', async function (done) {
                const defaultConfig = new Config({
                  apiKey,
                  apiSecret,
                  apiUrlRoot,
                });

                const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
                const messageId = 'unknown';
                const response = await inboxSdk.deleteInboxItem(messageId);
                expect(response).toBeInstanceOf(SuccessResponse);
                const { result } = response;
                expect(result).toBeDefined();
                expect(result.trans_id).toBeNull();
                done();
              });// eo it

            });// eo describe

          });// eo describe

          // TODO: Test with a known message ID.
        });// eo describe

        describe('using overriding config', function () {

          it('should delete the inbox item', async function (done) {
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

            const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
            const messageId = 'unknown';
            const response = await inboxSdk.deleteInboxItem(messageId, overridingConfig);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.trans_id).toBeNull();
            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.deleteInboxItem')

    describe('.getInboxItem', function () {

      xdescribe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the inbox item', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
            const messageId = 'ico-lock-64x64.png.f02cde11-85d5-42bf-be53-e1e930a4a52b'; // FIXME: TODO: Get a legit message ID.
            const response = await inboxSdk.getInboxItem(messageId);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.inbox_item).toBeDefined();
            const { inbox_item } = result;
            expect(inbox_item.download_link).toMatch('ico-lock-64x64.png');
            expect(inbox_item.info).toBeDefined();
            expect(inbox_item.info.file_tags).toEqual([]);
            expect(inbox_item.info.file_type).toBe(1015);
            expect(inbox_item.info.user_ref).toBe('243f0e2c-8b8a-11e8-8e3e-cb82c9b75eed');
            // TODO: Add more expectations.
            done();
          });// eo it

        });// eo describe

        describe('using overriding config', function () {

          it('should fetch and return with the inbox item', async function (done) {
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

            const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
            const messageId = 'ico-lock-64x64.png.f02cde11-85d5-42bf-be53-e1e930a4a52b'; // FIXME: TODO: Get a legit message ID.
            const response = await inboxSdk.getInboxItem(messageId, overridingConfig);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.inbox_item).toBeDefined();
            const { inbox_item } = result;
            expect(inbox_item.download_link).toMatch('ico-lock-64x64.png');
            expect(inbox_item.info).toBeDefined();
            expect(inbox_item.info.file_tags).toEqual([]);
            expect(inbox_item.info.file_type).toBe(1015);
            expect(inbox_item.info.user_ref).toBe('243f0e2c-8b8a-11e8-8e3e-cb82c9b75eed');
            // TODO: Add more expectations.
            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', async function () {

        it('should return with an error response', async function (done) {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
          const messageId = 'ico-lock-64x64.png.f02cde11-85d5-42bf-be53-e1e930a4a52b'; // FIXME: TODO: Get a legit message ID.
          const response = await inboxSdk.getInboxItem(messageId);
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.getInboxItem')

    describe('.listInbox', function () {

      // FIXME: TODO: Get Inbox to a known state with at least one item to search for.
      xdescribe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s inbox items', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await inboxSdk.listInbox();
            expect(response).toBeInstanceOf(PagingResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
            const inboxItems = result.data;
            expect(inboxItems.length).toBeGreaterThan(0);
            const inboxItem = inboxItems[0];
            expect(inboxItem.fileName).toBe('ico-lock-64x64.png');
            expect(inboxItem.messageId).toBe('ico-lock-64x64.png.f02cde11-85d5-42bf-be53-e1e930a4a52b');
            expect(inboxItem.fileSize).toBe(2628);
            expect(inboxItem.sender).toBeDefined();
            expect(inboxItem.sender.from).toBe('MBDYlKvqerX4iam4BOi9k+VsRAPB9Bd7n1h+5ehEE+WDZSm+xRtmklTO8bWazyztrkis4w==');
            expect(inboxItem.sender.from_xcoobee_id).toBe('~SDKTester_Developer');
            expect(inboxItem.sender.name).toBe('SDK Tester');
            expect(inboxItem.sender.validation_score).toBe(1);
            assertIso8601Like(inboxItem.receiptDate);
            assertIso8601Like(inboxItem.downloadDate);
            assertIso8601Like(inboxItem.expirationDate);

            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);

            done();
          });// eo it

        });// eo describe

        describe('using overriding config', function () {

          it('should fetch and return with the user\'s inbox items', async function (done) {
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

            const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await inboxSdk.listInbox(null, null, overridingConfig);
            expect(response).toBeInstanceOf(PagingResponse);
            const { result } = response;
            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
            const inboxItems = result.data;
            expect(inboxItems.length).toBeGreaterThan(0);
            const inboxItem = inboxItems[0];
            expect(inboxItem.fileName).toBe('ico-lock-64x64.png');
            expect(inboxItem.messageId).toBe('ico-lock-64x64.png.f02cde11-85d5-42bf-be53-e1e930a4a52b');
            expect(inboxItem.fileSize).toBe(2628);
            expect(inboxItem.sender).toBeDefined();
            expect(inboxItem.sender.from).toBe('MBDYlKvqerX4iam4BOi9k+VsRAPB9Bd7n1h+5ehEE+WDZSm+xRtmklTO8bWazyztrkis4w==');
            expect(inboxItem.sender.from_xcoobee_id).toBe('~SDKTester_Developer');
            expect(inboxItem.sender.name).toBe('SDK Tester');
            expect(inboxItem.sender.validation_score).toBe(1);
            assertIso8601Like(inboxItem.receiptDate);
            assertIso8601Like(inboxItem.downloadDate);
            assertIso8601Like(inboxItem.expirationDate);

            expect(response.hasNextPage()).toBe(false);
            const nextPageResponse = await response.getNextPage();
            expect(nextPageResponse).toBe(null);

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

          const inboxSdk = new Inbox(defaultConfig, apiAccessTokenCache, usersCache);
          const response = await inboxSdk.listInbox();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.error.message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.listInbox')

  });// eo describe('instance')

});// eo describe('Inbox')
