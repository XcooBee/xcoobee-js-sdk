const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const {
  confirmConsentChange,
  confirmDataDelete,
  getCookieConsent,
  getConsentData,
  listConsents,
  resolveXcoobeeId,
  requestConsent,
} = require('../../../../../src/xcoobee/api/ConsentsApi');

describe('ConsentsApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('confirmConsentChange', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ confirm_consent_change: { consent_cursor: 'consentId' } }));

      return confirmConsentChange('apiUrlRoot', 'accessToken', 'consentId')
        .then((res) => {
          expect(res.confirmed).toBeTruthy();
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].consentCursor).toBe('consentId');
        });
    });

  });

  describe('confirmDataDelete', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ confirm_consent_deletion: { consent_cursor: 'consentId' } }));

      return confirmDataDelete('apiUrlRoot', 'accessToken', 'consentId')
        .then((res) => {
          expect(res.confirmed).toBeTruthy();
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].consentCursor).toBe('consentId');
        });
    });

  });

  describe('getCookieConsent', () => {

    it('should return falsy values', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ consents: { data: [], page_info: {} } }));

      return getCookieConsent('apiUrlRoot', 'accessToken', '~xid', 'userId', 'consentId')
        .then((res) => {
          expect(res.cookie_consents.advertising_cookie).toBeFalsy();
          expect(res.cookie_consents.application_cookie).toBeFalsy();
          expect(res.cookie_consents.statistics_cookie).toBeFalsy();
          expect(res.cookie_consents.usage_cookie).toBeFalsy();
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.campaignIds[0]).toBe('consentId');
          expect(options.statuses[0]).toBe('active');
          expect(options.userCursor).toBe('userId');
        });
    });

    it('should return some truthy values', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({
        consents: {
          data: [
            { user_xcoobee_id: '~xid', request_data_types: ['advertising_cookie'], consent_type: 'web_application_tracking' },
            { user_xcoobee_id: '~xid', request_data_types: ['statistics_cookie', 'usage_cookie'], consent_type: 'web_application_tracking' },
          ],
          page_info: {},
        },
      }));

      return getCookieConsent('apiUrlRoot', 'accessToken', '~xid', 'userId', 'consentId')
        .then((res) => {
          expect(res.cookie_consents.advertising_cookie).toBeTruthy();
          expect(res.cookie_consents.application_cookie).toBeFalsy();
          expect(res.cookie_consents.statistics_cookie).toBeTruthy();
          expect(res.cookie_consents.usage_cookie).toBeTruthy();
        });
    });

  });

  describe('getConsentData', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ consent: 'consentData' }));

      return getConsentData('apiUrlRoot', 'accessToken', 'consentId')
        .then((res) => {
          expect(res.consent).toBe('consentData');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].consentCursor).toBe('consentId');
        });
    });

  });

  describe('listConsents', () => {

    it('should throw an error if invalid status given', () => {
      try {
        listConsents('apiUrlRoot', 'accessToken', 'userId', 'invalid');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Invalid consent status: invalid.  Must be one of active, canceled, expired, pending, offer, rejected, updating.');
      }
    });

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ consents: ['consent1', 'consent2'] }));

      return listConsents('apiUrlRoot', 'accessToken', 'userId', 'canceled')
        .then((res) => {
          expect(res[0]).toBe('consent1');
          expect(res[1]).toBe('consent2');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].statuses[0]).toBe('canceled');
          expect(GraphQLClient.prototype.request.mock.calls[0][1].userCursor).toBe('userId');
        });
    });

  });

  describe('resolveXcoobeeId', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ consent: { user_xcoobee_id: '~xid' } }));

      return resolveXcoobeeId('apiUrlRoot', 'accessToken', 'consentId')
        .then((res) => {
          expect(res).toBe('~xid');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].consentCursor).toBe('consentId');
        });
    });

  });

  describe('requestConsent', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ send_consent_request: { ref_id: 'refId' } }));

      return requestConsent('apiUrlRoot', 'accessToken', '~xid', 'campaignId', 'refId')
        .then((res) => {
          expect(res.ref_id).toBe('refId');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.campaign_cursor).toBe('campaignId');
          expect(options.config.reference).toBe('refId');
          expect(options.config.xcoobee_id).toBe('~xid');
        });
    });

  });

});