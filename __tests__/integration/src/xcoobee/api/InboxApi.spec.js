import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import InboxApi from '../../../../../src/xcoobee/api/InboxApi';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import { assertIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('InboxApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.deleteInboxItem', function () {

    describe('called with a valid API access token', function () {

      describe('and a valid user cursor', function () {

        describe('but with an unknown message ID', function () {

          it('should return with a null transaction ID', async function (done) {
            const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
            const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
            const userCursor = user.cursor;
            const messageId = 'unknown';
            const results = await InboxApi.deleteInboxItem(apiUrlRoot, apiAccessToken, userCursor, messageId);
            expect(results).toBeDefined();
            expect(results.trans_id).toBeNull();
            done();
          });// eo it

        });// eo describe

        // TODO: Test with a known message ID.
      });// eo describe

    });// eo describe

  });// eo describe('.deleteInboxItem')

  describe('.getInboxItem', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return the inbox item', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const messageId = 'ico-lock-64x64.png.f02cde11-85d5-42bf-be53-e1e930a4a52b';
        const results = await InboxApi.getInboxItem(apiUrlRoot, apiAccessToken, userCursor, messageId);
        expect(results).toBeDefined();
        expect(results.inbox_item).toBeDefined();
        const { inbox_item } = results;
        expect(inbox_item.download_link).toMatch('ico-lock-64x64.png');
        expect(inbox_item.info).toBeDefined();
        expect(inbox_item.info.file_tags).toEqual([]);
        expect(inbox_item.info.file_type).toBe(1015);
        expect(inbox_item.info.user_ref).toBe('243f0e2c-8b8a-11e8-8e3e-cb82c9b75eed');
        // TODO: Add more expectations.
        done();
      });// eo it

    });// eo describe

  });// eo describe('.getInboxItem')

  describe('.listInbox', function () {

    describe('called with a valid API access token', function () {

      describe('and called with no starting message ID', function () {

        it('should fetch and return with a list of inbox items', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const results = await InboxApi.listInbox(apiUrlRoot, apiAccessToken);
          expect(results).toBeDefined();
          expect(results.inbox).toBeDefined();
          expect(results.inbox.data).toBeInstanceOf(Array);
          expect(results.inbox.page_info).toBeDefined();
          expect(results.inbox.page_info.end_cursor).toBe('tJnf+3ZKrQCKYIMpUKUt236I1xDa2E91la7vYPr8qwL+GwitmaI++y/6SxDeXFLiq2segVucQxy51tdENjtf7d0BRFnjB5tyNXE5yMPPVaY=');
          expect(results.inbox.page_info.has_next_page).toBeNull();
          const inboxItems = results.inbox.data;
          // Not yet sure if this will always be the case, but it is right now.
          expect(inboxItems.length).toBe(1);
          const inboxItem = inboxItems[0];
          expect(inboxItem.fileName).toBe('ico-lock-64x64.png');
          expect(inboxItem.messageId).toBe('ico-lock-64x64.png.f02cde11-85d5-42bf-be53-e1e930a4a52b');
          expect(inboxItem.fileSize).toBe(2628);
          expect(inboxItem.sender).toBeDefined();
          expect(inboxItem.sender.from).toBe('MBDYlKvqerX4iam4BOi9k+VsRAPB9Bd7n1h+5ehEE+WDZSm+xRtmklTO8bWazyztrkis4w==');
          expect(inboxItem.sender.from_xcoobee_id).toBe('~SDK_Tester');
          expect(inboxItem.sender.name).toBe('SDK Tester');
          expect(inboxItem.sender.validation_score).toBe(1);
          assertIso8601Like(inboxItem.receiptDate);
          assertIso8601Like(inboxItem.downloadDate);
          assertIso8601Like(inboxItem.expirationDate);
          done();
        });// eo it

      });// eo describe

      describe('and called with a starting message ID', function () {

        it('should fetch and return with a list of inbox items', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const startId = 'tJnf+3ZKrQCKYIMpUKUt236I1xDa2E91la7vYPr8qwL+GwitmaI++y/6SxDeXFLiq2segVucQxy51tdENjtf7d0BRFnjB5tyNXE5yMPPVaY=';
          const results = await InboxApi.listInbox(apiUrlRoot, apiAccessToken, startId);
          expect(results).toBeDefined();
          expect(results.inbox).toBeDefined();
          expect(results.inbox.data).toBeInstanceOf(Array);
          expect(results.inbox.page_info).toBeDefined();
          expect(results.inbox.page_info.end_cursor).toBeNull();
          expect(results.inbox.page_info.has_next_page).toBeNull();
          const inboxItems = results.inbox.data;
          expect(inboxItems.length).toBe(0);
          done();
        });// eo it

      });// eo describe

    });// eo describe

  });// eo describe('.listInbox')

});// eo describe('InboxApi')
