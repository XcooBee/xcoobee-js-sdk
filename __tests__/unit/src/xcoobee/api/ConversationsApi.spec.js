const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const {
  getConversation,
  getConversations,
  sendUserMessage,
} = require('../../../../../src/xcoobee/api/ConversationsApi');

describe('ConversationsApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('getConversation', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ conversation: 'conversationData' }));

      return getConversation('apiUrlRoot', 'accessToken', 'targetId')
        .then((res) => {
          expect(res).toBe('conversationData');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].targetCursor).toBe('targetId');
        });
    });

  });

  describe('getConversations', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ conversations: ['conversation1', 'conversation2'] }));

      return getConversations('apiUrlRoot', 'accessToken', 'userId')
        .then((res) => {
          expect(res[0]).toBe('conversation1');
          expect(res[1]).toBe('conversation2');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].userCursor).toBe('userId');
        });
    });

  });

  describe('sendUserMessage', () => {

    it('should send message with consent note type', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message', 'userId', 'consentId')
        .then((res) => {
          expect(res).toBeTruthy();

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.consent_cursor).toBe('consentId');
          expect(options.config.message).toBe('message');
          expect(options.config.note_type).toBe('consent');
          expect(options.config.user_cursor).toBe('userId');
        });
    });

    it('should send message with breach note type', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message', 'userId', 'consentId', 'breachId')
        .then((res) => {
          expect(res).toBeTruthy();

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.consent_cursor).toBe('consentId');
          expect(options.config.breach_cursor).toBe('breachId');
          expect(options.config.message).toBe('message');
          expect(options.config.note_type).toBe('breach');
          expect(options.config.user_cursor).toBe('userId');
        });
    });

  });

});
