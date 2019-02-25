const Path = require('path');

const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const EndPointApi = require('../../../../../src/xcoobee/api/EndPointApi');
const PolicyApi = require('../../../../../src/xcoobee/api/PolicyApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const { assertIsCursorLike, assertCompactIso8601Like } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('PolicyApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.upload_policy', () => {

    describe('called with a valid API access token', () => {

      describe('and called with an "outbox" upload policy intent ', () => {

        it('should return an upload policy for each file', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
          const userCursor = user.cursor;
          const result = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
          expect(result).toBeDefined();
          const { data, page_info } = result;
          expect(page_info).toBe(null);
          // expect(page_info.end_cursor).toBeDefined();
          // expect(page_info.has_next_page).toBe(false);
          expect(data).toBeDefined();
          const endPoints = data;
          const endPointName = 'outbox';
          expect(endPoints).toBeInstanceOf(Array);
          let candidateEndPoints = endPoints.filter((endPoint) => {
            return endPoint.name === endPointName;
          });
          expect(candidateEndPoints.length).toBeLessThanOrEqual(1);
          if (candidateEndPoints.length === 0) {
            candidateEndPoints = endPoints.filter((endPoint) => {
              return endPoint.name === 'flex';
            });
          }
          expect(candidateEndPoints.length).toBe(1);
          const endPoint = candidateEndPoints[0];
          const endPointCursor = endPoint.cursor;
          assertIsCursorLike(endPointCursor);
          const intent = endPointName;

          const files = [
            Path.resolve(__dirname, '..', '..', '..', 'assets', 'upload-policy-test.txt'),
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
