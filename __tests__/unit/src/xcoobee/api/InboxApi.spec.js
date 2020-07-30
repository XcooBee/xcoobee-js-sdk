jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const {
  deleteInboxItem,
  getInboxItem,
  listInbox,
} = require('../../../../../src/xcoobee/api/InboxApi');

describe('InboxApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('deleteInboxItem', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ remove_inbox_item: { trans_id: 'transId' } }));

      return deleteInboxItem('apiUrlRoot', 'accessToken', 'userId', 'image.png')
        .then((res) => {
          expect(res).toBeTruthy();
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].userCursor).toBe('userId');
          expect(GraphQLClient.prototype.request.mock.calls[0][1].messageId).toBe('image.png');
        });
    });

  });

  describe('getInboxItem', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ inbox_item: { download_link: 'link_to_download_file' } }));

      return getInboxItem('apiUrlRoot', 'accessToken', 'userId', 'image.png')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.inbox_item.download_link).toBe('link_to_download_file');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].userCursor).toBe('userId');
          expect(GraphQLClient.prototype.request.mock.calls[0][1].messageId).toBe('image.png');
        });
    });

  });

  describe('listInbox', () => {

    it('should call graphql endpoint with params', () => {
      const data = [
        {
          filename: 'test.jpg',
          original_name: 'test.jpg',
          file_size: 1024,
          sender: {
            name: 'XcooBee',
          },
          date: '2019-01-01',
          downloaded: '2019-01-01',
        },
      ];
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ inbox: { data, page_info: {} } }));

      return listInbox('apiUrlRoot', 'accessToken')
        .then((res) => {
          expect(res).toBeInstanceOf(Object);
          expect(res.data).toBeInstanceOf(Array);
          expect(res.data.length).toBe(1);

          const item = res.data[0];
          expect(item).toBeInstanceOf(Object);
          expect(item.messageId).toBe('test.jpg');
          expect(item.fileName).toBe('test.jpg');
          expect(item.fileSize).toBe(1024);
          expect(item.sender.name).toBe('XcooBee');
          expect(item.receiptDate).toBe('2019-01-01');
          expect(item.downloadDate).toBe('2019-01-01');
          expect(item.expirationDate).toBe('2019-01-01');

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
        });
    });

  });

});
