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

    it('should throw an error if no reference provided', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('At least one reference should be provided');
        });
    });

    it('should send message with consent note type', () => {
      GraphQLClient.prototype.request
        .mockReturnValueOnce(Promise.resolve({ note_target: { cursor: 'userId' } }))
        .mockReturnValueOnce(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message', { consentId: 'consentId' })
        .then((res) => {
          expect(res).toBeTruthy();

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(2);

          const options = GraphQLClient.prototype.request.mock.calls[1][1];
          expect(options.config.reference_cursor).toBe('consentId');
          expect(options.config.message).toBe('message');
          expect(options.config.note_type).toBe('consent');
          expect(options.config.user_cursor).toBe('userId');
        });
    });

    it('should send message with ticket note type', () => {
      GraphQLClient.prototype.request
        .mockReturnValueOnce(Promise.resolve({ note_target: { cursor: 'userId' } }))
        .mockReturnValueOnce(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message', { ticketId: 'ticketId' })
        .then((res) => {
          expect(res).toBeTruthy();

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(2);

          const options = GraphQLClient.prototype.request.mock.calls[1][1];
          expect(options.config.reference_cursor).toBe('ticketId');
          expect(options.config.message).toBe('message');
          expect(options.config.note_type).toBe('ticket');
          expect(options.config.user_cursor).toBe('userId');
        });
    });

    it('should send message with data request note type', () => {
      GraphQLClient.prototype.request
        .mockReturnValueOnce(Promise.resolve({ note_target: { cursor: 'userId' } }))
        .mockReturnValueOnce(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message', { requestRef: 'requestRef' })
        .then((res) => {
          expect(res).toBeTruthy();

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(2);

          const options = GraphQLClient.prototype.request.mock.calls[1][1];
          expect(options.config.reference_cursor).toBe('requestRef');
          expect(options.config.message).toBe('message');
          expect(options.config.note_type).toBe('data_request');
          expect(options.config.user_cursor).toBe('userId');
        });
    });

  });

});
