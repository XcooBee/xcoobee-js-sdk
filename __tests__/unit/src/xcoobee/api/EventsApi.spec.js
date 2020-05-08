const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const { getEvents, triggerEvent } = require('../../../../../src/xcoobee/api/EventsApi');

jest.mock('../../../../../src/xcoobee/core/EncryptionUtils');

const EncryptionUtils = require('../../../../../src/xcoobee/core/EncryptionUtils');

describe('EventsApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('getEvents', () => {

    it('should get events and decrypt payload', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({
        events: {
          data: [{ payload: 'encryptedPayload' }],
          page_info: {},
        },
      }));

      EncryptionUtils.decryptWithEncryptedPrivateKey.mockReturnValue('{"decrypted": "test"}');

      return getEvents('apiUrlRoot', 'accessToken', 'userId', 'privateKey', 'passphrase')
        .then((res) => expect(res.data[0].payload.decrypted).toBe('test'));
    });

  });

  describe('triggerEvent', () => {

    it('should get events and decrypt payload', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({
        send_test_event: {
          topic: 'campaign:123.qwerty/consent_approved',
          payload: 'encrypted',
        },
      }));

      return triggerEvent('apiUrlRoot', 'accessToken', 'campaign:123.qwerty/consent_approved')
        .then((res) => {
          expect(res.topic).toBe('campaign:123.qwerty/consent_approved');

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.topic).toBe('campaign:123.qwerty/consent_approved');
        });
    });

  });

});
