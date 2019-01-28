const sinon = require('sinon');
const { GraphQLClient } = require('graphql-request');

const {
  getConversation,
  getConversations,
  sendUserMessage,
} = require('../../../../../src/xcoobee/api/ConversationsApi');

describe('ConversationsApi', () => {

  afterEach(() => sinon.restore());

  describe('getConversation', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ conversation: 'conversationData' }));

      return getConversation('apiUrlRoot', 'accessToken', 'targetId')
        .then((res) => {
          expect(res).toBe('conversationData');
          expect(stub.calledOnce).toBeTruthy();
          expect(stub.getCall(0).args[1].targetCursor).toBe('targetId');
        });
    });

  });

  describe('getConversations', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ conversations: ['conversation1', 'conversation2'] }));

      return getConversations('apiUrlRoot', 'accessToken', 'userId')
        .then((res) => {
          expect(res[0]).toBe('conversation1');
          expect(res[1]).toBe('conversation2');
          expect(stub.calledOnce).toBeTruthy();
          expect(stub.getCall(0).args[1].userCursor).toBe('userId');
        });
    });

  });

  describe('sendUserMessage', () => {

    it('should send message with consent note type', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message', 'userId', 'consentId')
        .then((res) => {
          expect(res).toBeTruthy();
          expect(stub.calledOnce).toBeTruthy();

          const options = stub.getCall(0).args[1];
          expect(options.config.consent_cursor).toBe('consentId');
          expect(options.config.message).toBe('message');
          expect(options.config.note_type).toBe('consent');
          expect(options.config.user_cursor).toBe('userId');
        });
    });

    it('should send message with breach note type', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ send_message: true }));

      return sendUserMessage('apiUrlRoot', 'accessToken', 'message', 'userId', 'consentId', 'breachId')
        .then((res) => {
          expect(res).toBeTruthy();
          expect(stub.calledOnce).toBeTruthy();

          const options = stub.getCall(0).args[1];
          expect(options.config.consent_cursor).toBe('consentId');
          expect(options.config.breach_cursor).toBe('breachId');
          expect(options.config.message).toBe('message');
          expect(options.config.note_type).toBe('breach');
          expect(options.config.user_cursor).toBe('userId');
        });
    });

  });

});
