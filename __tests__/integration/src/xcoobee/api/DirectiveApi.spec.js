import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import DirectiveApi from '../../../../../src/xcoobee/api/DirectiveApi';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('DirectiveApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.addDirective', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a valid directive input', function () {

        it('should return a reference ID', async function (done) {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const directiveInput = {
            filenames: [],
          };
          const result = await DirectiveApi.addDirective(apiUrlRoot, apiAccessToken, directiveInput);
          expect(result).toBeDefined();
          expect(result.ref_id).toBeDefined();
          done();

          // TODO: Test with a variety of directive inputs.
        });// eo it

      });// eo describe

    });// eo describe

  });// eo describe('.addDirective')

});// eo describe('DirectiveApi')
