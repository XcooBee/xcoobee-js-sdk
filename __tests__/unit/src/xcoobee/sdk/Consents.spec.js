const jest = require('jest');

jest.mock('../../../../../src/xcoobee/api/CampaignApi');
jest.mock('../../../../../src/xcoobee/api/ConsentsApi');
jest.mock('../../../../../src/xcoobee/api/ConversationsApi');
jest.mock('../../../../../src/xcoobee/api/DirectiveApi');
jest.mock('../../../../../src/xcoobee/sdk/FileUtils');

const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');
const ConsentsApi = require('../../../../../src/xcoobee/api/ConsentsApi');
const FileUtils = require('../../../../../src/xcoobee/sdk/FileUtils');

const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');

const Consents = require('../../../../../src/xcoobee/sdk/Consents');

describe('Consents', () => {

  const consents = new Consents({
    apiKey: 'apiKey',
    apiSecret: 'apiSecret',
    apiUrlRoot: 'apiUrlRoot',
  }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId' }) });

  describe('listCampaigns', () => {

    it('should return response with consents inside', () => {
      CampaignApi.getCampaigns.mockReturnValue(Promise.resolve({ data: [{ name: 'campaign1' }, { name: 'campaign2' }], page_info: {} }));

      return consents.listCampaigns()
        .then((res) => {
          expect(CampaignApi.getCampaigns).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data.length).toBe(2);
          expect(res.result.data[0].name).toBe('campaign1');
          expect(res.result.data[1].name).toBe('campaign2');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('listConsents', () => {

    it('should return response with consents inside', () => {
      ConsentsApi.listConsents.mockReturnValue(Promise.resolve({ data: [{ name: 'consent1' }, { name: 'consent2' }], page_info: {} }));

      return consents.listConsents(['new'])
        .then((res) => {
          expect(ConsentsApi.listConsents).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', ['new'], null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data.length).toBe(2);
          expect(res.result.data[0].name).toBe('consent1');
          expect(res.result.data[1].name).toBe('consent2');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('requestConsent', () => {

    it('should return response with ref_id inside', () => {
      ConsentsApi.requestConsent.mockReturnValue(Promise.resolve({ ref_id: 'refId' }));

      return consents.requestConsent('~xid', null, 'campaignId')
        .then((res) => {
          expect(ConsentsApi.requestConsent).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', '~xid', 'campaignId', null);

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.ref_id).toBe('refId');
        });
    });

  });

  describe('getCookieConsent', () => {

    it('should return response with cookie statistics inside', () => {
      ConsentsApi.getCookieConsent.mockReturnValue(Promise.resolve({
        cookie_consents: { statistics_cookie: true },
      }));

      return consents.getCookieConsent('~xid', 'campaignId')
        .then((res) => {
          expect(ConsentsApi.getCookieConsent).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', '~xid', 'userId', 'campaignId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.cookie_consents.statistics_cookie).toBeTruthy();
        });
    });

  });

  describe('getConsentData', () => {

    it('should return response with consent data inside', () => {
      ConsentsApi.getConsentData.mockReturnValue(Promise.resolve({
        consent: { consent_description: 'test' },
      }));

      return consents.getConsentData('consentId')
        .then((res) => {
          expect(ConsentsApi.getConsentData).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'consentId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.consent.consent_description).toBe('test');
        });
    });

  });

  describe('getCampaignInfo', () => {

    it('should return response with campaign data inside', () => {
      CampaignApi.getCampaignInfo.mockReturnValue(Promise.resolve({
        campaign: { campaign_name: 'test' },
      }));

      return consents.getCampaignInfo('campaignId')
        .then((res) => {
          expect(CampaignApi.getCampaignInfo).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'campaignId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.campaign.campaign_name).toBe('test');
        });
    });

  });

  describe('confirmConsentChange', () => {

    it('should return response with confirmed flag inside', () => {
      ConsentsApi.confirmConsentChange.mockReturnValue(Promise.resolve({ confirmed: true }));

      return consents.confirmConsentChange('consentId')
        .then((res) => {
          expect(ConsentsApi.confirmConsentChange).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'consentId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.confirmed).toBeTruthy();
        });
    });

  });

  describe('declineConsentChange', () => {

    it('should return response with confirmed flag inside', () => {
      ConsentsApi.declineConsentChange.mockReturnValue(Promise.resolve({ confirmed: true }));

      return consents.declineConsentChange('consentId')
        .then((res) => {
          expect(ConsentsApi.declineConsentChange).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'consentId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.confirmed).toBeTruthy();
        });
    });

  });

  describe('confirmDataDelete', () => {

    it('should return response with confirmed flag inside', () => {
      ConsentsApi.confirmDataDelete.mockReturnValue(Promise.resolve({ confirmed: true }));

      return consents.confirmDataDelete('consentId')
        .then((res) => {
          expect(ConsentsApi.confirmDataDelete).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'consentId');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.confirmed).toBeTruthy();
        });
    });

  });

  describe('setUserDataResponse', () => {

    it('should upload file, send data response and return progress', () => {
      FileUtils.upload.mockReturnValue(Promise.resolve([{ file: 'test.png', success: true }]));
      ConsentsApi.setUserDataResponse.mockReturnValue(Promise.resolve('referenceId'));

      return consents.setUserDataResponse('message', 'refId', 'test.png', 'url', 'handler')
        .then((res) => {
          expect(ConsentsApi.setUserDataResponse).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'message', 'refId', 'test.png', 'url', 'handler');

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.progress).toBeInstanceOf(Array);
          expect(res.result.progress[0]).toBe('successfully uploaded test.png');
          expect(res.result.progress[1]).toBe('successfully sent data response');
          expect(res.result.ref_id).toBe('referenceId');
        });
    });

    it('should throw error if unable to upload file', () => {
      FileUtils.upload.mockReturnValue(Promise.resolve([{ error: 'validation error', file: 'test', success: false }]));

      return consents.setUserDataResponse('message', 'refId', 'test', 'url', 'handler')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(FileUtils.upload).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', ['test.png']);

          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('Failed to upload file: test. Error: validation error.');
        });
    });

  });

  describe('getDataPackage', () => {

    it('should return response with confirmed flag inside', () => {
      ConsentsApi.getDataPackage.mockReturnValue(Promise.resolve({ payload: 'decrypted_payload' }));

      return consents.getDataPackage('consentId')
        .then((res) => {
          expect(ConsentsApi.getDataPackage).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'consentId', undefined, undefined);

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.payload).toBe('decrypted_payload');
        });
    });

  });

  describe('registerConsents', () => {

    it('should return response', () => {
      FileUtils.upload.mockReturnValue(Promise.resolve([{ file: 'test.csv', success: true }]));
      ConsentsApi.registerConsents.mockReturnValue(Promise.resolve('ref_id'));
      const targets = [{
        target: '~test',
        date_received: '2019-01-01',
        date_expires: 's2020-01-01',
      }];

      return consents
        .registerConsents('campaignId', 'test.csv', targets, 'ref_id')
        .then((res) => {
          expect(ConsentsApi.registerConsents)
            .toHaveBeenCalledWith(
              'apiUrlRoot',
              'apiAccessToken',
              'campaignId',
              'test.csv',
              [{
                target: '~test',
                date_received: '2019-01-01',
                date_expires: 's2020-01-01',
              }],
              'ref_id'
            );

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result).toBe('ref_id');
        });
    });
  });
});
