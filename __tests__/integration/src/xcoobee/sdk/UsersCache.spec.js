import ApiAccessTokenCache from '../../../../../src/xcoobee/sdk/ApiAccessTokenCache';
import UsersCache from '../../../../../src/xcoobee/sdk/UsersCache';

import { sleep } from '../../../../lib/Utils';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('UsersCache', function () {

  describe('instance', function () {

    describe('.get', function () {

      describe('called with a valid API key/secret pair', function () {

        it('should fetch and return with user info', function (done) {
          let apiAccessTokenCache = new ApiAccessTokenCache();
          (new UsersCache(apiAccessTokenCache)).get(apiKey, apiSecret)
            .then((userInfo) => {
              expect(userInfo).toBeDefined();
              expect('cursor' in userInfo).toBe(true);
              expect('pgp_public_key' in userInfo).toBe(true);
              expect('xcoobee_id' in userInfo).toBe(true);
              done();
            });
        });

      });// eo describe

      describe('called with a valid API key/secret pair multiple times back to back', function () {

        it('should return the cached user info', function (done) {
          let apiAccessTokenCache = new ApiAccessTokenCache();
          let usersCache = new UsersCache(apiAccessTokenCache);
          Promise.all([
            usersCache.get(apiKey, apiSecret),
            usersCache.get(apiKey, apiSecret),
          ]).then((userInfoList) => {
            expect(userInfoList[0]).toBe(userInfoList[1]);
            done();
          });
        });

      });// eo describe

      describe('called with a valid API key/secret pair multiple times sequentially', function () {

        it('should return the cached user info', function (done) {
          let apiAccessTokenCache = new ApiAccessTokenCache();
          let usersCache = new UsersCache(apiAccessTokenCache);
          usersCache.get(apiKey, apiSecret)
            .then((userInfo1) => {
              usersCache.get(apiKey, apiSecret)
                .then((userInfo2) => {
                  expect(userInfo1).toBe(userInfo2);
                  done();
                });
            });
        });

      });// eo describe

      describe('called with a valid API key/secret pair multiple times sequentially with a pause in between', function () {

        it('should return the cached user info', function (done) {
          let apiAccessTokenCache = new ApiAccessTokenCache();
          let usersCache = new UsersCache(apiAccessTokenCache);
          usersCache.get(apiKey, apiSecret)
            .then((userInfo1) => {
              sleep(10000)
                .then(() => {
                  usersCache.get(apiKey, apiSecret)
                    .then((userInfo2) => {
                      expect(userInfo1).toBe(userInfo2);
                      done();
                    });
                });
            });
        });

      });// eo describe

    });// eo describe('.get')

  });// eo describe('instance')

});// eo describe('UsersCache')
