import Path from 'path';

import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';
import Bees from '../../../../../src/xcoobee/sdk/Bees';
import Config from '../../../../../src/xcoobee/sdk/Config';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';
import UsersCache from '../../../../../src/xcoobee/sdk/UsersCache';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Bees', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    describe('.listBees', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the bees available to the user', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await beesSdk.listBees('');
            expect(response).toBeInstanceOf(SuccessResponse);
            const bees = response.data;
            expect(bees).toBeInstanceOf(Array);
            expect(bees.length).toBe(0);
            // TODO: Add more expectations.
            done();
          });// eo it

        });// eo describe

        describe('using overriding config', function () {

          it('should fetch and return with the bees available to the user', async function (done) {
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
            expect(response).toBeInstanceOf(SuccessResponse);
            const bees = response.data;
            expect(bees).toBeInstanceOf(Array);
            expect(bees.length).toBe(0);
            // TODO: Add more expectations.
            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', function () {

        it('should return with an error response', async function (done) {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
            apiUrlRoot,
          });

          const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);
          const response = await beesSdk.listBees();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.errors).toBeInstanceOf(Array);
          expect(response.errors.length).toBe(1);
          expect(response.errors[0].message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.listBees')

    describe('.uploadFiles', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should successfully upload files', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
              apiUrlRoot,
            });

            const file = Path.resolve(__dirname, '..', '..', '..', 'assets', 'test.txt');
            const files = [file];
            const beesSdk = new Bees(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await beesSdk.uploadFiles(files);
            expect(response).toBeInstanceOf(SuccessResponse);
            const results = response.data;
            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBe(1);
            const result = results[0];
            expect(result.file).toBe(file);
            expect(result.success).toBe(true);
            done();
          });// eo it

          // TODO: Test with multiple files.
        });// eo describe

      });// eo describe

    });// eo describe('.uploadFiles')

  });// eo describe('instance')

});// eo describe('Bees')
