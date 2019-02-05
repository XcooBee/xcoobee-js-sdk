const jest = require('jest');

jest.mock('../../../../../src/xcoobee/api/EventsApi');
jest.mock('../../../../../src/xcoobee/api/EventSubscriptionsApi');
jest.mock('../../../../../src/xcoobee/api/CampaignApi');

const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');
const EventsApi = require('../../../../../src/xcoobee/api/EventsApi');
const EventSubscriptionsApi = require('../../../../../src/xcoobee/api/EventSubscriptionsApi');
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
  }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId' }) });

  describe('addEventSubscription', () => {

    it('should return ErrorResponse if any errors', () => {
      EventSubscriptionsApi.addEventSubscription.mockReturnValue(Promise.reject({ message: 'error' }));

      return system.addEventSubscription({ ConsentApproved: 'test' }, 'campaignId')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with added event subscriptions', () => {
      EventSubscriptionsApi.addEventSubscription.mockReturnValue(Promise.resolve({ data: [{ handler: 'test' }], page_info: {} }));

      return system.addEventSubscription({ ConsentApproved: 'test' }, 'campaignId')
        .then((res) => {
          expect(EventSubscriptionsApi.addEventSubscription).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', { ConsentApproved: 'test' }, 'campaignId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].handler).toBe('test');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('deleteEventSubscription', () => {

    it('should return ErrorResponse if any errors', () => {
      EventSubscriptionsApi.deleteEventSubscription.mockReturnValue(Promise.reject({ message: 'error' }));

      return system.deleteEventSubscription({ ConsentApproved: 'test' }, 'campaignId')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return response with deleted number', () => {
      EventSubscriptionsApi.deleteEventSubscription.mockReturnValue(Promise.resolve({ deleted_number: 1 }));

      return system.deleteEventSubscription({ ConsentApproved: 'test' }, 'campaignId')
        .then((res) => {
          expect(EventSubscriptionsApi.deleteEventSubscription).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', { ConsentApproved: 'test' }, 'campaignId');

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

      return system.listEventSubscriptions('campaignId')
        .then((res) => {
          expect(EventSubscriptionsApi.listEventSubscriptions).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'campaignId', null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data[0].handler).toBe('test');
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

  describe('ping', () => {

    it('should return ErrorResponse if user doesn\'t have pgp key', () => {
      return system.ping()
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('PGP key not found.');
        });
    });

    it('should return ErrorResponse if there was an error on getting campaign info', () => {
      const systemModel = new System({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId', pgp_public_key: 'pgpKey' }) });

      CampaignApi.getCampaignInfo.mockReturnValue(Promise.reject({ message: 'error' }));

      return systemModel.ping()
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return ErrorResponse if campaign not found', () => {
      const systemModel = new System({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId', pgp_public_key: 'pgpKey' }) });

      CampaignApi.getCampaignInfo.mockReturnValue(Promise.resolve({ campaign: null }));

      return systemModel.ping()
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('Campaign not found.');
        });
    });

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

});
