const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

jest.mock('../../../../../src/xcoobee/core/EncryptionUtils');

const EncryptionUtils = require('../../../../../src/xcoobee/core/EncryptionUtils');

const {
  confirmConsentChange,
  confirmDataDelete,
  declineConsentChange,
  getCookieConsent,
  getConsentData,
  getDataPackage,
  listConsents,
  resolveXcoobeeId,
  requestConsent,
  registerConsents,
  setUserDataResponse,
  shareConsents,
  dontSellData,
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

  describe('declineConsentChange', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ decline_consent_change: { consent_cursor: 'consentId' } }));

      return declineConsentChange('apiUrlRoot', 'accessToken', 'consentId')
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

    it('should throw an error if invalid date from given', () => {
      try {
        listConsents('apiUrlRoot', 'accessToken', 'userId', { dateFrom: 'invalid' });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Invalid date string given: invalid.');
      }
    });

    it('should throw an error if invalid date to given', () => {
      try {
        listConsents('apiUrlRoot', 'accessToken', 'userId', { dateTo: 'invalid' });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Invalid date string given: invalid.');
      }
    });

    it('should throw an error if invalid status given', () => {
      try {
        listConsents('apiUrlRoot', 'accessToken', 'userId', { statuses: ['canceled', 'invalid'] });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Invalid consent status: invalid.  Must be one of active, canceled, expired, pending, offer, rejected, updating.');
      }
    });

    it('should throw an error if invalid type given', () => {
      try {
        listConsents('apiUrlRoot', 'accessToken', 'userId', { consentTypes: ['invalid'] });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Invalid consent type: invalid.  Must be one of anonymized_data_aggregation, billing, care_delivery, company_information, contractor_management, create_custom_product, create_custom_service, create_custom_service_and_product, data_aggregation, deliver_a_product, deliver_itiniary_changes, emergency_request, emergency_services, employee_administration, employee_management, financial_reports, government_services, health_billing, health_care_services, iot_device_tracking, it_administration, law_enforcement, marketing, missing, mobile_device_tracking, order_fullfillment, other, perform_a_service, perform_contract, press_releaseases, private_consent, product_announcement, product_information, promotion, shipping, supplier_screening, support, support_a_product, support_a_service, survey, training, travel, web_application_tracking, website_tracking.');
      }
    });

    it('should throw an error if invalid data type given', () => {
      try {
        listConsents('apiUrlRoot', 'accessToken', 'userId', { dataTypes: ['invalid'] });
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Invalid consent data type: invalid.  Must be one of advertising_cookie, alternate_email, alternate_phone, application_cookie, bank_accounts, biometric_data, browser_details, city, colleagues, country, criminal_conviction, custom, date_of_birth, dental_record, device_identifiers, email, emergency_medical_record, ethnicity_race, family_members, first_name, friends, genetic_data, government_document_references, government_id, health_metrics, health_record, image, internet_access_record, ip_address, last_name, location_data, membership, mental_health_record, meter_reading, middle_name, name_prefix, name_suffix, other1, other2, other3, other4, other5, other6, other7, other8, other9, party_affiliation, phone, physical_health_record, religion, sexual_orientation, social_posts, state, statistics_cookie, street1, street2, twitter_handle, usage_cookie, xcoobee_id.');
      }
    });

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ consents: ['consent1', 'consent2'] }));

      return listConsents('apiUrlRoot', 'accessToken', 'userId', {
        query: 'Cool',
        country: 'US',
        province: 'California',
        city: 'Los Angeles',
        dateFrom: '2019-01-01',
        dateTo: '2019-12-31',
        statuses: ['canceled'],
        consentTypes: ['perform_contract', 'perform_a_service'],
        dataTypes: ['first_name', 'middle_name', 'last_name'],
      })
        .then((res) => {
          expect(res[0]).toBe('consent1');
          expect(res[1]).toBe('consent2');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          expect(GraphQLClient.prototype.request.mock.calls[0][1]).toEqual({
            after: null,
            first: null,
            userCursor: 'userId',
            query: 'Cool',
            country: 'US',
            province: 'California',
            city: 'Los Angeles',
            dateFrom: '2019-01-01',
            dateTo: '2019-12-31',
            statuses: ['canceled'],
            consentTypes: ['perform_contract', 'perform_a_service'],
            dataTypes: ['first_name', 'middle_name', 'last_name'],
          });
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

  describe('setUserDataResponse', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ send_data_response: { ref_id: 'refId' } }));

      return setUserDataResponse('apiUrlRoot', 'accessToken', 'test message', 'requestRef', '/path/to/data.txt')
        .then((res) => {
          expect(res).toBe('refId');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.message).toBe('test message');
          expect(options.config.request_ref).toBe('requestRef');
          expect(options.config.filenames[0]).toBe('data.txt');
        });
    });

  });

  describe('getDataPackage', () => {

    it('should return decrypted package', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ data_package: [{ data: 'encrypted' }] }));

      return getDataPackage('apiUrlRoot', 'accessToken', 'consentId')
        .then((res) => {
          expect(res[0].payload).toBe('encrypted');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.consentId).toBe('consentId');
        });
    });

    it('should decrypt package', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ data_package: [{ data: 'encrypted' }] }));
      EncryptionUtils.decryptWithEncryptedPrivateKey.mockReturnValue('{"decrypted": "test"}');

      return getDataPackage('apiUrlRoot', 'accessToken', 'consentId', 'privateKey', 'passphrase')
        .then((res) => {
          expect(res[0].payload.decrypted).toBe('test');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.consentId).toBe('consentId');

          expect(EncryptionUtils.decryptWithEncryptedPrivateKey).toHaveBeenCalledWith('encrypted', 'privateKey', 'passphrase');
        });
    });

  });

  describe('registerConsents', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ register_consents: { ref_id: 'refId' } }));
      const targets = [{
        target: '~test',
        date_received: '2019-01-01',
        date_expires: 's2020-01-01',
      }];

      return registerConsents('apiUrlRoot', 'accessToken', 'campaignId', 'test.txt', targets, 'ref_id')
        .then((res) => {
          expect(res).toBe('refId');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.campaign_cursor).toBe('campaignId');
          expect(options.config.targets).toEqual([{
            target: '~test',
            date_received: '2019-01-01',
            date_expires: 's2020-01-01',
          }]);
          expect(options.config.filename).toBe('test.txt');
        });
    });

  });

  describe('shareConsents', () => {

    it('should throw an error if no campaignId and consentIds provided', () => {
      try {
        shareConsents('apiUrlRoot', 'accessToken', 'campaignRef');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('Either campaignId or consentIds should be provided');
      }
    });

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ share_consents: { ref_id: 'refId' } }));

      return shareConsents('apiUrlRoot', 'accessToken', 'campaignRef', 'campaignId')
        .then((res) => {
          expect(res).toBe('refId');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config).toEqual({
            campaign_reference: 'campaignRef',
            campaign_cursor: 'campaignId',
            consent_cursors: [],
          });
        });
    });

  });

  describe('dontSellData', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve());

      return dontSellData('apiUrlRoot', 'accessToken', 'test@email.com')
        .then((res) => {
          expect(res).toBe(true);
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          expect(GraphQLClient.prototype.request.mock.calls[0][1].email).toBe('test@email.com');
        });
    });

  });

});
