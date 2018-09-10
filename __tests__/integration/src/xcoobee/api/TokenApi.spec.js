import TokenApi from '../../../../../src/xcoobee/api/TokenApi';

import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

import { assertIsJwtToken, sleep } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('TokenApi', function () {

  describe('.getApiAccessToken', function () {

    describe('called with a valid API key/secret pair', function () {

      it('should fetch and return with an API access token', function (done) {
        TokenApi.getApiAccessToken({
          apiKey,
          apiSecret,
          apiUrlRoot,
        })
          .then(apiAccessToken => {
            expect(apiAccessToken).toBeDefined();
            assertIsJwtToken(apiAccessToken);
            done();
          })
      });// eo it

    });// eo describe

    describe('called with a valid API key/secret pair multiple times back to back', function () {

      it('should return the same promise', function (done) {
        let promise1 = TokenApi.getApiAccessToken({
          apiKey,
          apiSecret,
          apiUrlRoot,
        });
        let promise2 = TokenApi.getApiAccessToken({
          apiKey,
          apiSecret,
          apiUrlRoot,
        });
        expect(promise1).toBe(promise2);
        Promise.all([
          promise1,
          promise2,
        ])
          .then(apiAccessTokens => {
            expect(apiAccessTokens[0]).toBe(apiAccessTokens[1]);
            done();
          });
      });// eo it

    });// eo describe

    describe('called with a valid API key/secret pair multiple times sequentially with a long enough pause in between', function () {

      it('should return different promises and different access tokens', function (done) {
        let promise1 = TokenApi.getApiAccessToken({
          apiKey,
          apiSecret,
          apiUrlRoot,
        });
        promise1.then(apiAccessToken1 => {
          sleep(1000)
            .then(() => {
              let promise2 = TokenApi.getApiAccessToken({
                apiKey,
                apiSecret,
                apiUrlRoot,
              });
              expect(promise1).not.toBe(promise2);
              promise2.then(apiAccessToken2 => {
                expect(apiAccessToken1).not.toBe(apiAccessToken2);
                done();
              });
            });
        });
      });// eo it

    });// eo describe

    describe('called with an invalid API key/secret pair', function () {

      it('should reject with a XcooBeeError', function (done) {
        const apiKey = 'invalid';
        const apiSecret = 'invalid';

        TokenApi.getApiAccessToken({ apiKey, apiSecret, apiUrlRoot })
          .then(apiAccessToken_unused => {
            // This should not be called.
            expect(true).toBe(false);
          })
          .catch(err => {
            expect(err).toBeInstanceOf(XcooBeeError);
            expect(err.message).toBe('Unable to get an API access token.');
            done();
          });
      });// eo it

    });// eo describe

  });// eo describe('.getApiAccessToken')

});// eo describe('TokenApi')
