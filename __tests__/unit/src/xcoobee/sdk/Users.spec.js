const jest = require('jest');

jest.mock('../../../../../src/xcoobee/api/ConversationsApi');

const ConversationsApi = require('../../../../../src/xcoobee/api/ConversationsApi');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');

const Users = require('../../../../../src/xcoobee/sdk/Users');

describe('Users', () => {

  const users = new Users({
    apiKey: 'apiKey',
    apiSecret: 'apiSecret',
    apiUrlRoot: 'apiUrlRoot',
  }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId' }) });

  describe('getConversation', () => {

    it('should return response with messages of conversation', () => {
      ConversationsApi.getConversation.mockReturnValue(Promise.resolve({ data: [{ display_name: 'XcooBee System' }], page_info: {} }));

      return users.getConversation('targetUserId')
        .then((res) => {
          expect(ConversationsApi.getConversation).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'targetUserId', null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].display_name).toBe('XcooBee System');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('getConversations', () => {

    it('should return response with conversations', () => {
      ConversationsApi.getConversations.mockReturnValue(Promise.resolve({ data: [{ display_name: 'XcooBee System' }], page_info: {} }));

      return users.getConversations()
        .then((res) => {
          expect(ConversationsApi.getConversations).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].display_name).toBe('XcooBee System');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('getUser', () => {

    it('should return ErrorResponse if any errors', () => {
      const usersModel = new Users({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' }, { get: () => Promise.reject({ message: 'error' }) });

      return usersModel.getUser({ ConsentApproved: 'test' }, 'campaignId')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with user data', () => {
      const usersModel = new Users({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' }, { get: () => ({ firstname: 'test' }) });

      return usersModel.getUser({ ConsentApproved: 'test' }, 'campaignId')
        .then((res) => {
          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.data.firstname).toBe('test');
        });
    });

  });

  describe('sendUserMessage', () => {

    it('should return ErrorResponse if any errors', () => {
      ConversationsApi.sendUserMessage.mockReturnValue(Promise.reject({ message: 'error' }));

      return users.sendUserMessage('message', 'consentId')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with added note', () => {
      ConversationsApi.sendUserMessage.mockReturnValue(Promise.resolve({ note_text: 'message' }));

      return users.sendUserMessage('message', 'consentId')
        .then((res) => {
          expect(ConversationsApi.sendUserMessage).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'message', 'userId', 'consentId', null);

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.data.note_text).toBe('message');
        });
    });

  });

});
