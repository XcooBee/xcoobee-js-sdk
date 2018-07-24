import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';
import Config from '../../../../../src/xcoobee/sdk/Config';
import ErrorResponse from '../../../../../src/xcoobee/sdk/ErrorResponse';
import SuccessResponse from '../../../../../src/xcoobee/sdk/SuccessResponse';
import Users from '../../../../../src/xcoobee/sdk/Users';
import UsersCache from '../../../../../src/xcoobee/sdk/UsersCache';

import { assertIsCursorLike } from '../../../../lib/Utils';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('Users', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('instance', function () {

    describe('.getUser', function () {

      describe('called with a valid API key/secret pair', function () {

        describe('using default config', function () {

          it('should fetch and return with the user\'s information', async function (done) {
            const defaultConfig = new Config({
              apiKey,
              apiSecret,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await usersSdk.getUser();
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const userInfo = response.data;
            expect('cursor' in userInfo).toBe(true);
            assertIsCursorLike(userInfo.cursor);
            expect('pgp_public_key' in userInfo).toBe(true);
            expect('xcoobee_id' in userInfo).toBe(true);
            done();
          });// eo it

        });// eo describe

        describe('using overriding config', function () {

          it('should fetch and return with the user\'s information', async function (done) {
            const defaultConfig = new Config({
              apiKey: 'should_be_unused',
              apiSecret: 'should_be_unused',
            });
            const overridingConfig = new Config({
              apiKey,
              apiSecret,
            });

            const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
            const response = await usersSdk.getUser(overridingConfig);
            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(SuccessResponse);
            const userInfo = response.data;
            expect('cursor' in userInfo).toBe(true);
            assertIsCursorLike(userInfo.cursor);
            expect('pgp_public_key' in userInfo).toBe(true);
            expect('xcoobee_id' in userInfo).toBe(true);
            done();
          });// eo it

        });// eo describe

      });// eo describe

      describe('called with an invalid API key/secret pair', function () {

        it('should return with an error response', async function (done) {
          const defaultConfig = new Config({
            apiKey: 'invalid',
            apiSecret: 'invalid',
          });

          const usersSdk = new Users(defaultConfig, apiAccessTokenCache, usersCache);
          const response = await usersSdk.getUser();
          expect(response).toBeDefined();
          expect(response).toBeInstanceOf(ErrorResponse);
          expect(response.code).toBe(400);
          expect(response.errors).toBeInstanceOf(Array);
          expect(response.errors.length).toBe(1);
          expect(response.errors[0].message).toBe('Unable to get an API access token.');
          done();
        });// eo it

      });// eo describe

    });// eo describe('.getUser')

  });// eo describe('instance')

});// eo describe('Users')
