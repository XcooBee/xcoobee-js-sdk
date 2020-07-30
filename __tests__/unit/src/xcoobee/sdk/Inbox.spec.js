jest.mock('../../../../../src/xcoobee/api/InboxApi');

const InboxApi = require('../../../../../src/xcoobee/api/InboxApi');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');

const Inbox = require('../../../../../src/xcoobee/sdk/Inbox');

describe('Inbox', () => {

  const inbox = new Inbox({
    apiKey: 'apiKey',
    apiSecret: 'apiSecret',
    apiUrlRoot: 'apiUrlRoot',
  }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId' }) });

  describe('listInbox', () => {

    it('should return response with inbox items', () => {
      InboxApi.listInbox.mockReturnValue(Promise.resolve({ data: [{ messageId: 'test.png' }], page_info: {} }));

      return inbox.listInbox()
        .then((res) => {
          expect(InboxApi.listInbox).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].messageId).toBe('test.png');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('getInboxItem', () => {

    it('should return ErrorResponse if any errors', () => {
      InboxApi.getInboxItem.mockReturnValue(Promise.reject({ message: 'error' }));

      return inbox.getInboxItem('messageId')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with inbox item info', () => {
      InboxApi.getInboxItem.mockReturnValue(Promise.resolve({ inbox_item: { info: { filename: 'test.png' } } }));

      return inbox.getInboxItem('messageId')
        .then((res) => {
          expect(InboxApi.getInboxItem).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'messageId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.inbox_item.info.filename).toBe('test.png');
        });
    });

  });

  describe('deleteInboxItem', () => {

    it('should return ErrorResponse if any errors', () => {
      InboxApi.deleteInboxItem.mockReturnValue(Promise.reject({ message: 'error' }));

      return inbox.deleteInboxItem('messageId')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with success', () => {
      InboxApi.deleteInboxItem.mockReturnValue(Promise.resolve({ delete_inbox_item: { trans_id: null } }));

      return inbox.deleteInboxItem('messageId')
        .then((res) => {
          expect(InboxApi.deleteInboxItem).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'messageId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.delete_inbox_item.trans_id).toBeNull();
        });
    });

  });

});
