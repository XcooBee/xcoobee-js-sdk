const jestMock = require('jest-mock');

jest.mock('../../../../../src/xcoobee/api/EventsApi');
jest.mock('../../../../../src/xcoobee/api/EventSubscriptionsApi');
jest.mock('../../../../../src/xcoobee/api/CampaignApi');
jest.mock('../../../../../src/xcoobee/core/EncryptionUtils');

const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');
const EventsApi = require('../../../../../src/xcoobee/api/EventsApi');
const EventSubscriptionsApi = require('../../../../../src/xcoobee/api/EventSubscriptionsApi');
const EncryptionUtils = require('../../../../../src/xcoobee/core/EncryptionUtils');
const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');

const System = require('../../../../../src/xcoobee/sdk/System');

describe('System', () => {

  const system = new System({
    apiKey: 'apiKey',
    apiSecret: 'apiSecret',
    apiUrlRoot: 'apiUrlRoot',
    pgpPassword: 'pgpPassword',
    pgpSecret: 'pgpSecret',
  }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId', xcoobee_id: '~xid' }) });

  describe('addEventSubscriptions', () => {

    it('should return ErrorResponse if any errors', () => {
      EventSubscriptionsApi.addEventSubscriptions.mockReturnValue(Promise.reject({ message: 'error' }));

      return system.addEventSubscriptions([{ topic: 'campaign:123.qwerty/consent_approved', channel: 'inbox' }])
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with added event subscriptions', () => {
      EventSubscriptionsApi.addEventSubscriptions.mockReturnValue(Promise.resolve({ data: [{ handler: 'test' }], page_info: {} }));

      return system.addEventSubscriptions([{ topic: 'campaign:123.qwerty/consent_approved', channel: 'inbox' }])
        .then((res) => {
          expect(EventSubscriptionsApi.addEventSubscriptions).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', [{ topic: 'campaign:123.qwerty/consent_approved', channel: 'inbox' }]);

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].handler).toBe('test');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('deleteEventSubscriptions', () => {

    it('should return ErrorResponse if any errors', () => {
      EventSubscriptionsApi.deleteEventSubscriptions.mockReturnValue(Promise.reject({ message: 'error' }));

      return system.deleteEventSubscriptions([{ topic: 'campaign:123.qwerty/consent_approved' }])
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with deleted number', () => {
      EventSubscriptionsApi.deleteEventSubscriptions.mockReturnValue(Promise.resolve({ deleted_number: 1 }));

      return system.deleteEventSubscriptions([{ topic: 'campaign:123.qwerty/consent_approved' }])
        .then((res) => {
          expect(EventSubscriptionsApi.deleteEventSubscriptions).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', [{ topic: 'campaign:123.qwerty/consent_approved' }]);

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.deleted_number).toBe(1);
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('listEventSubscriptions', () => {

    it('should return response with event subscriptions', () => {
      EventSubscriptionsApi.listEventSubscriptions.mockReturnValue(Promise.resolve({ data: [{ handler: 'test' }], page_info: {} }));

      return system.listEventSubscriptions('campaignId', 'campaign')
        .then((res) => {
          expect(EventSubscriptionsApi.listEventSubscriptions).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'campaignId', 'campaign');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].handler).toBe('test');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('getAvailableSubscriptions', () => {

    it('should return response with available event subscriptions', () => {
      EventSubscriptionsApi.getAvailableSubscriptions.mockReturnValue(Promise.resolve([{ topic: 'campaign:123.qwerty/*', channels: ['webhook'] }]));

      return system.getAvailableSubscriptions('campaignId', 'campaign')
        .then((res) => {
          expect(EventSubscriptionsApi.getAvailableSubscriptions).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'campaignId', 'campaign');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result[0].topic).toBe('campaign:123.qwerty/*');
          expect(res.result[0].channels[0]).toBe('webhook');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('unsuspendEventSubscription', () => {

    it('should return response with available event subscriptions', () => {
      EventSubscriptionsApi.unsuspendEventSubscription.mockReturnValue(Promise.resolve([{ topic: 'campaign:123.qwerty/*', channels: ['webhook'] }]));

      return system.unsuspendEventSubscription('campaign:123.qwerty/consent_approved', 'webhook')
        .then((res) => {
          expect(EventSubscriptionsApi.unsuspendEventSubscription).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'campaign:123.qwerty/consent_approved', 'webhook');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result[0].topic).toBe('campaign:123.qwerty/*');
          expect(res.result[0].channels[0]).toBe('webhook');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('getEvents', () => {

    it('should return response with events', () => {
      EventsApi.getEvents.mockReturnValue(Promise.resolve({ data: [{ payload: { decrypted: 'test' } }], page_info: {} }));

      return system.getEvents()
        .then((res) => {
          expect(EventsApi.getEvents).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'pgpSecret', 'pgpPassword', null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].payload.decrypted).toBe('test');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('triggerEvent', () => {

    it('should return response with events', () => {
      EventsApi.triggerEvent.mockReturnValue(Promise.resolve({ event_type: 'consent_approved' }));

      return system.triggerEvent('ConsentApproved', { campaignId: 'campaignId' })
        .then((res) => {
          expect(EventsApi.triggerEvent).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'campaignId', 'ConsentApproved');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.event_type).toBe('consent_approved');
        });
    });

  });

  describe('ping', () => {

    it('should return response with true result', () => {
      const systemModel = new System({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId', pgp_public_key: 'pgpKey' }) });

      CampaignApi.getCampaignInfo.mockReturnValue(Promise.resolve({ campaign: { campaign_name: 'test' } }));

      return systemModel.ping()
        .then((res) => {
          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result).toBeTruthy();
        });
    });

  });

  describe('handleEvents', () => {

    describe('passed events', () => {

      it('should throw an error if no handlers passed', () => {
        return system.handleEvents({}, [{ payload: 'test', handler: 'invalid' }])
          .then(() => expect(false).toBe(true)) // this will never happen
          .catch((err) => {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe('At least one handler should be passed');
          });
      });

      it('should throw an error if handler not exist', () => {
        return system.handleEvents({ myHandler: () => {} }, [{ payload: 'test', handler: 'invalid' }])
          .then(() => expect(false).toBe(true)) // this will never happen
          .catch((err) => {
            expect(err).toBeInstanceOf(XcooBeeError);
            expect(err.message).toBe('Handler \'invalid\' is not defined');
          });
      });

      it('should call hanled with payload', () => {
        const testHandler = jestMock.fn();

        return system.handleEvents({ testHandler }, [{ payload: 'payloadMessage', handler: 'testHandler' }])
          .then(() => expect(testHandler).toHaveBeenCalledWith('payloadMessage'));
      });

    });

    describe('events from webhook', () => {

      it('should throw an error if signature is invalid', () => {
        return system.handleEvents({ myHandler: () => {} }, [], 'payload', { 'XBEE-SIGNATURE': 'invalid' })
          .then(() => expect(false).toBe(true)) // this will never happen
          .catch((err) => {
            expect(err).toBeInstanceOf(XcooBeeError);
            expect(err.message).toBe('Invalid signature');
          });
      });

      it('should decrypt payload and call habdler', () => {
        const testHandler = jestMock.fn();

        EncryptionUtils.decryptWithEncryptedPrivateKey.mockReturnValue(Promise.resolve({ decrypted: true }));

        return system.handleEvents(
          { testHandler },
          [],
          'encryptedPayload',
          {
            'XBEE-HANDLER': 'testHandler',
            'XBEE-SIGNATURE': '5b647c4580c3fa24b1e9a6f7c3d3d568d9b6569d', // encryptedPayload message with ~xid pass
          }
        ).then(() => {
          expect(EncryptionUtils.decryptWithEncryptedPrivateKey).toHaveBeenCalledWith(
            'encryptedPayload',
            'pgpSecret',
            'pgpPassword'
          );
          expect(testHandler).toHaveBeenCalledWith({ decrypted: true });
        });
      });

      it('should use lovercase headers', () => {
        const testHandler = jestMock.fn();

        EncryptionUtils.decryptWithEncryptedPrivateKey.mockReturnValue(Promise.resolve({ decrypted: true }));

        return system.handleEvents(
          { testHandler },
          [],
          'encryptedPayload',
          {
            'xbee-handler': 'testHandler',
            'xbee-signature': '5b647c4580c3fa24b1e9a6f7c3d3d568d9b6569d', // encryptedPayload message with ~xid pass
          }
        ).then(() => {
          expect(EncryptionUtils.decryptWithEncryptedPrivateKey).toHaveBeenCalledWith(
            'encryptedPayload',
            'pgpSecret',
            'pgpPassword'
          );
          expect(testHandler).toHaveBeenCalledWith({ decrypted: true });
        });
      });

      it('should call habdler with encrypted payload', () => {
        const testHandler = jestMock.fn();

        EncryptionUtils.decryptWithEncryptedPrivateKey.mockReturnValue(Promise.resolve('encryptedPayload'));

        return system.handleEvents(
          { testHandler },
          [],
          'encryptedPayload',
          {
            'XBEE-HANDLER': 'testHandler',
            'XBEE-SIGNATURE': '5b647c4580c3fa24b1e9a6f7c3d3d568d9b6569d', // encryptePayload message with ~xid pass
          }
        ).then(() => expect(testHandler).toHaveBeenCalledWith('encryptedPayload'));
      });

    });

  });

});
