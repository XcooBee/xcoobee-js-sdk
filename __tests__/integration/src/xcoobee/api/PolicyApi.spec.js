import Path from 'path';

import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import EndPointApi from '../../../../../src/xcoobee/api/EndPointApi';
import PolicyApi from '../../../../../src/xcoobee/api/PolicyApi';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import { assertIsCursorLike, assertCompactIso8601Like } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('PolicyApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.upload_policy', function () {

    describe('called with a valid API access token', function () {

      describe('and called with an "outbox" upload policy intent ', function () {

        it('should return an upload policy for each file', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = user.cursor;
          const endPoints = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
          const endPointName = 'outbox';
          expect(endPoints).toBeInstanceOf(Array);
          let candidateEndPoints = endPoints.filter(endPoint => {
            return endPoint.name === endPointName;
          });
          expect(candidateEndPoints.length).toBeLessThanOrEqual(1);
          if (candidateEndPoints.length === 0) {
            candidateEndPoints = endPoints.filter(endPoint => {
              return endPoint.name === 'flex';
            });
          }
          expect(candidateEndPoints.length).toBe(1);
          const endPoint = candidateEndPoints[0];
          const endPointCursor = endPoint.cursor;
          assertIsCursorLike(endPointCursor);
          const intent = endPointName;

          const files = [
            Path.resolve(__dirname, '..', '..', '..', 'assets', 'test.txt'),
          ];
          const policies = await PolicyApi.upload_policy(apiUrlRoot, apiAccessToken, intent, endPointCursor, files);
          expect(policies).toBeInstanceOf(Array);
          expect(policies.length).toBe(1);
          const policy = policies[0];
          expect(policy).toBeDefined();
          expect(policy.credential).toBeDefined();
          expect(policy.date).toBeDefined();
          assertCompactIso8601Like(policy.date);
          expect(policy.identifier).toBeDefined();
          expect(policy.key).toBeDefined();
          expect(policy.policy).toBeDefined();
          expect(policy.signature).toBeDefined();
          expect(policy.upload_url).toBeDefined();
          done();
        });// eo it

      });// eo describe

    });// eo describe

  });// eo describe('.upload_policy')

});// eo describe('PolicyApi')
