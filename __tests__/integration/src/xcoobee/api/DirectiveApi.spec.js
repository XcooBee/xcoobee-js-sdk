const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const DirectiveApi = require('../../../../../src/xcoobee/api/DirectiveApi');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('DirectiveApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.addDirective', () => {

    describe('called with a valid API access token', () => {

      describe('and called with a valid directive input', () => {

        it('should return a reference ID', async (done) => {
          const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
          const directiveInput = {
            filenames: [],
          };
          const refId = await DirectiveApi.addDirective(apiUrlRoot, apiAccessToken, directiveInput);
          expect(refId).toBeDefined();

          done();

          // TODO: Test with a variety of directive inputs.
        });// eo it

      });// eo describe

    });// eo describe

  });// eo describe('.addDirective')

});// eo describe('DirectiveApi')
