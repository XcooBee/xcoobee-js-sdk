const Path = require('path');

const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const Bees = require('../../../../../src/xcoobee/sdk/Bees');
const Config = require('../../../../../src/xcoobee/sdk/Config');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const SuccessResponse = require('../../../../../src/xcoobee/sdk/SuccessResponse');

const { findBeesBySystemName } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Bees', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', () => {

    describe('.listBees', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should fetch and return with the bees available to the user', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await beesSdk.listBees('');
            expect(response).toBeInstanceOf(PagingResponse);
            const { result } = response;
            expect(result).toBeDefined();
            const bees = result.data;
            expect(bees).toBeInstanceOf(Array);

            const filteredBees = findBeesBySystemName(bees, 'xcoobee_bee_watermark');
            expect(filteredBees.length).toBe(1);
            expect(filteredBees[0].bee_system_name).toBe('xcoobee_bee_watermark');

            done();
          });// eo it

        });// eo describe

        describe('using overriding config', () => {

          it('should fetch and return with the bees available to the user', async (done) => {
            const defaultConfig = new Config({
              apiKey: 'should_be_unused',
              apiSecret: 'should_be_unused',
              apiUrlRoot: 'should_be_unused',
            });
            const overridingConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await beesSdk.listBees('', overridingConfig);
            expect(response).toBeInstanceOf(PagingResponse);
            const { result } = response;
            expect(result).toBeDefined();
            const bees = result.data;
            expect(bees).toBeInstanceOf(Array);

            const filteredBees = findBeesBySystemName(bees, 'xcoobee_bee_watermark');
            expect(filteredBees.length).toBe(1);
            expect(filteredBees[0].bee_system_name).toBe('xcoobee_bee_watermark');

            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', () => {

        it('should reject with an error response', async (done) => {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);

          try {
            await beesSdk.listBees();
            // This should not be called.
            expect(true).toBe(false);
          } catch (response) {
            expect(response).toBeInstanceOf(ErrorResponse);
            expect(response.code).toBe(400);
            expect(response.error.message).toBe('[Failure] Cannot process request');
          }

          done();
        });// eo it

      });// eo describe

    });// eo describe('.listBees')

    describe('.takeOff', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should make bees take off', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);
            const bees = [];
            const options = {
              process: {
                fileNames: [],
                userReference: 'asdf',
              },
            };
            const response = await beesSdk.takeOff(bees, options);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeDefined();
            const { ref_id } = result;
            expect(ref_id).toBeDefined();

            done();
          });// eo it

        });// eo describe

      });// eo describe

    });// eo describe('.takeOff')

    describe('.uploadFiles', () => {

      describe('called with a valid API key/secret pair', () => {

        describe('using default config', () => {

          it('should successfully upload files', async (done) => {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const file = Path.resolve(__dirname, '..', '..', '..', 'assets', 'bees-upload-files-test.txt');
            const files = [file];
            const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await beesSdk.uploadFiles(files);
            expect(response).toBeInstanceOf(SuccessResponse);
            const { result } = response;
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(1);
            const fileResult = result[0];
            expect(fileResult.file).toBe('bees-upload-files-test.txt');
            expect(fileResult.success).toBe(true);

            done();
          });// eo it

          // TODO: Test with multiple files.
        });// eo describe

      });// eo describe

    });// eo describe('.uploadFiles')

  });// eo describe('instance')

});// eo describe('Bees')
