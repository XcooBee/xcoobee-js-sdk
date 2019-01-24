const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const { assertIsJwtToken, sleep } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('ApiAccessTokenCache', () => {

  describe('instance', () => {

    describe('.get', () => {

      describe('called with a valid API key/secret pair', () => {

        it('should fetch and return an API access token', async (done) => {
          const apiAccessToken = await (new ApiAccessTokenCache()).get(apiUrlRoot, apiKey, apiSecret);
          expect(apiAccessToken).toBeDefined();
          assertIsJwtToken(apiAccessToken);
          done();
        });// eo it

      });// eo describe

      describe('called with a valid API key/secret pair multiple times back to back', () => {

        it('should return the cached API access token', async (done) => {
          const cache = new ApiAccessTokenCache();

          // Note: Not using async/await here since we need the calls to be back to back.
          Promise.all([
            cache.get(apiUrlRoot, apiKey, apiSecret),
            cache.get(apiUrlRoot, apiKey, apiSecret),
          ])
            .then((apiAccessTokens) => {
              expect(apiAccessTokens[0]).toBe(apiAccessTokens[1]);
              done();
            });

          const apiAccessTokens = await Promise.all([
            cache.get(apiUrlRoot, apiKey, apiSecret),
            cache.get(apiUrlRoot, apiKey, apiSecret),
          ]);
          expect(apiAccessTokens[0]).toBe(apiAccessTokens[1]);
          done();
        });// eo it

      });// eo describe

      describe('called with a valid API key/secret pair multiple times sequentially', () => {

        it('should return the cached API access token', async (done) => {
          let cache = new ApiAccessTokenCache();
          cache.get(apiUrlRoot, apiKey, apiSecret)
            .then((apiAccessToken1) => {
              cache.get(apiUrlRoot, apiKey, apiSecret)
                .then((apiAccessToken2) => {
                  expect(apiAccessToken1).toBe(apiAccessToken2);
                  done();
                });
            });

          cache = new ApiAccessTokenCache();
          const apiAccessToken1 = await cache.get(apiUrlRoot, apiKey, apiSecret);
          const apiAccessToken2 = await cache.get(apiUrlRoot, apiKey, apiSecret);
          expect(apiAccessToken1).toBe(apiAccessToken2);
          done();
        });// eo it

      });// eo describe

      describe('called with a valid API key/secret pair multiple times sequentially with a pause in between', () => {

        it('should return the cached API access token', async (done) => {
          let cache = new ApiAccessTokenCache();
          cache.get(apiUrlRoot, apiKey, apiSecret)
            .then((apiAccessToken1) => {
              sleep(10000)
                .then(() => {
                  cache.get(apiUrlRoot, apiKey, apiSecret)
                    .then((apiAccessToken2) => {
                      expect(apiAccessToken1).toBe(apiAccessToken2);
                      done();
                    });
                });
            });

          cache = new ApiAccessTokenCache();
          const apiAccessToken1 = await cache.get(apiUrlRoot, apiKey, apiSecret);
          await sleep(10000);
          const apiAccessToken2 = await cache.get(apiUrlRoot, apiKey, apiSecret);
          expect(apiAccessToken1).toBe(apiAccessToken2);
          done();
        });// eo it

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should reject with a XcooBeeError', async (done) => {
          (new ApiAccessTokenCache()).get(apiUrlRoot, 'invalid', 'invalid')
            .then(() => {
              // This should not be called.
              expect(true).toBe(false);
            })
            .catch((err) => {
              expect(err).toBeInstanceOf(XcooBeeError);
              expect(err.message).toBe('Unable to get an API access token.');
              done();
            });

          try {
            await (new ApiAccessTokenCache()).get(apiUrlRoot, 'invalid', 'invalid');
            // This should not be called.
            expect(true).toBe(false);
          } catch (err) {
            expect(err).toBeInstanceOf(XcooBeeError);
            expect(err.message).toBe('Unable to get an API access token.');
            done();
          }
        });// eo it

      });// eo describe

    });// eo describe('.get')

  });// eo describe('instance')

});// eo describe('ApiAccessTokenCache')
