const Path = require('path');

const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const EndPointApi = require('../../../../../src/xcoobee/api/EndPointApi');
const FileApi = require('../../../../../src/xcoobee/api/FileApi');
const PolicyApi = require('../../../../../src/xcoobee/api/PolicyApi');
const UsersCache = require('../../../../../src/xcoobee/api/UsersCache');

const { assertIsCursorLike } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('FileApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.upload_file', () => {

    describe('called with a valid policy', () => {

      it('should successfully upload a file', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const result = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
        expect(result).toBeDefined();
        const { data, page_info } = result;
        expect(page_info).toBe(null);
        expect(data).toBeDefined();
        const endPoints = data;
        expect(endPoints).toBeInstanceOf(Array);
        expect(endPoints.length).toBe(1);
        const endPoint = endPoints[0];
        assertIsCursorLike(endPoint.cursor);

        const files = [
          Path.resolve(__dirname, '..', '..', '..', 'assets', 'upload-file-test.txt'),
        ];
        const policies = await PolicyApi.upload_policy(apiUrlRoot, apiAccessToken, 'outbox', endPoint.cursor, files);
        expect(policies).toBeInstanceOf(Array);
        expect(policies.length).toBe(1);
        const policy = policies[0];
        expect(policy).toBeDefined();
        expect(policy.credential).toBeDefined();
        expect(policy.date).toBeDefined();
        expect(policy.identifier).toBeDefined();
        expect(policy.key).toBeDefined();
        expect(policy.policy).toBeDefined();
        expect(policy.signature).toBeDefined();
        expect(policy.upload_url).toBeDefined();

        const success = await FileApi.upload_file(files[0], policy);
        expect(success).not.toBe(false);
        done();
      });// eo it

    });// eo describe

  });// eo describe('.upload_policy')

});// eo describe('PolicyApi')
