const jest = require('jest');

jest.mock('../../../../../src/xcoobee/api/CampaignApi');
jest.mock('../../../../../src/xcoobee/api/ConsentsApi');
jest.mock('../../../../../src/xcoobee/api/ConversationsApi');
jest.mock('../../../../../src/xcoobee/api/DirectiveApi');
jest.mock('../../../../../src/xcoobee/sdk/FileUtils');

const CampaignApi = require('../../../../../src/xcoobee/api/CampaignApi');
const ConsentsApi = require('../../../../../src/xcoobee/api/ConsentsApi');
const ConversationsApi = require('../../../../../src/xcoobee/api/ConversationsApi');
const DirectiveApi = require('../../../../../src/xcoobee/api/DirectiveApi');
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

    it('should throw error if any', () => {
      ConversationsApi.sendUserMessage.mockReturnValue(Promise.reject({ message: 'test' }));

      return consents.setUserDataResponse('message', 'consentId')
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(ConversationsApi.sendUserMessage).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'message', { consentId: 'consentId' });

          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('test');
        });
    });

    it('should send user message, upload, send file and return progress', () => {
      ConversationsApi.sendUserMessage.mockReturnValue(Promise.resolve());
      FileUtils.upload.mockReturnValue(Promise.resolve([{ file: 'test.png', success: true }]));
      ConsentsApi.resolveXcoobeeId.mockReturnValue(Promise.resolve('~xcoobee_id'));
      DirectiveApi.addDirective.mockReturnValue(Promise.resolve('referenceId'));

      return consents.setUserDataResponse('message', 'consentId', 'refId', 'test.png')
        .then((res) => {
          expect(ConversationsApi.sendUserMessage).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'message', { consentId: 'consentId' });
          expect(FileUtils.upload).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', ['test.png']);
          expect(ConsentsApi.resolveXcoobeeId).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'consentId');
          expect(DirectiveApi.addDirective).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', {
            destinations: [{ xcoobee_id: '~xcoobee_id' }],
            filenames: ['test.png'],
            user_reference: 'refId',
          });

          expect(res).toBeInstanceOf(SuccessResponse);
          expect(res.code).toBe(200);
          expect(res.result.progress).toBeInstanceOf(Array);
          expect(res.result.progress[0]).toBe('successfully sent message');
          expect(res.result.progress[1]).toBe('successfully uploaded test.png');
          expect(res.result.progress[2]).toBe('successfully sent successfully uploaded file to destination');
          expect(res.result.ref_id).toBe('referenceId');
        });
    });

    it('should throw error if unable to upload file', () => {
      ConversationsApi.sendUserMessage.mockReturnValue(Promise.resolve());
      FileUtils.upload.mockReturnValue(Promise.resolve([{ error: 'validation error', file: 'test', success: false }]));
      ConsentsApi.resolveXcoobeeId.mockReturnValue(Promise.resolve('~xcoobee_id'));

      return consents.setUserDataResponse('message', 'consentId', 'refId', ['test'])
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(ConversationsApi.sendUserMessage).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'message', { consentId: 'consentId' });
          expect(FileUtils.upload).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', ['test.png']);
          expect(ConsentsApi.resolveXcoobeeId).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'consentId');

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

});
