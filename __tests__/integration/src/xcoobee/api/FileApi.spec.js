import Path from 'path';

import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import EndPointApi from '../../../../../src/xcoobee/api/EndPointApi';
import FileApi from '../../../../../src/xcoobee/api/FileApi';
import PolicyApi from '../../../../../src/xcoobee/api/PolicyApi';
import UsersCache from '../../../../../src/xcoobee/api/UsersCache';

import { assertIsCursorLike } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('FileApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();
  const usersCache = new UsersCache(apiAccessTokenCache);

  describe('.upload_file', function () {

    describe('called with a valid policy', function () {

      xit('should successfully upload a file', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const user = await usersCache.get(apiUrlRoot, apiKey, apiSecret);
        const userCursor = user.cursor;
        const endPoints = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);
        const intent = 'outbox';
        expect(endPoints).toBeInstanceOf(Array);
        let candidateEndPoints = endPoints.filter(endPoint => {
          return endPoint.name === intent;
        });
        expect(candidateEndPoints.length).toBe(1);
        const endPoint = candidateEndPoints[0];
        assertIsCursorLike(endPoint.cursor);

        const files = [
          Path.resolve(__dirname, '..', '..', '..', 'assets', 'upload-file-test.txt'),
        ];
        const policies = await PolicyApi.upload_policy(apiUrlRoot, apiAccessToken, endPoint, files)
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
