import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';

import { BASE64_URL_ENCODED__RE, sleep } from '../../../../lib/Utils';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ApiAccessTokenCache', function () {

  describe('instance', function () {

    describe('.get', function () {

      describe('called with a valid API key/secret pair', function () {

        it('should fetch and return an API access token', function (done) {
          (new ApiAccessTokenCache()).get(apiKey, apiSecret)
            .then((apiAccessToken) => {
              expect(apiAccessToken).toBeDefined();

              let apiAccessTokenParts = apiAccessToken.split('.');
              expect(apiAccessTokenParts.length).toBe(3);

              expect(apiAccessTokenParts[0]).toMatch(BASE64_URL_ENCODED__RE);
              expect(apiAccessTokenParts[1]).toMatch(BASE64_URL_ENCODED__RE);
              expect(apiAccessTokenParts[2]).toMatch(BASE64_URL_ENCODED__RE);
              done();
            });
        });

      });

      describe('called with a valid API key/secret pair multiple times back to back', function () {

        it('should return the cached API access token', function (done) {
          let cache = new ApiAccessTokenCache();
          Promise.all([
            cache.get(apiKey, apiSecret),
            cache.get(apiKey, apiSecret),
          ])
            .then((apiAccessTokens) => {
              expect(apiAccessTokens[0]).toBe(apiAccessTokens[1]);
              done();
            });
        });

      });

      describe('called with a valid API key/secret pair multiple times sequentially', function () {

        it('should return the cached API access token', function (done) {
          let cache = new ApiAccessTokenCache();
          cache.get(apiKey, apiSecret)
            .then((apiAccessToken1) => {
              cache.get(apiKey, apiSecret)
                .then((apiAccessToken2) => {
                  expect(apiAccessToken1).toBe(apiAccessToken2);
                  done();
                });
            });
        });

      });

      describe('called with a valid API key/secret pair multiple times sequentially with a pause in between', function () {

        it('should return the cached API access token', function (done) {
          let cache = new ApiAccessTokenCache();
          cache.get(apiKey, apiSecret)
            .then((apiAccessToken1) => {
              sleep(10000)
                .then(() => {
                  cache.get(apiKey, apiSecret)
                    .then((apiAccessToken2) => {
                      expect(apiAccessToken1).toBe(apiAccessToken2);
                      done();
                    });
                });
            });
        });

      });

    });

  });

});
