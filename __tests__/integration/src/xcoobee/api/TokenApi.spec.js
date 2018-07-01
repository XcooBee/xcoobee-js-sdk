import { BASE64_URL_ENCODED__RE } from '../../../../lib/Utils';

import TokenApi from '../../../../../src/xcoobee/api/TokenApi';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('TokenApi', function () {

  describe('.getApiAccessToken', function () {

    describe('called with a valid API key and API secret', function () {

      it('should fetch and return with an API access token', function (done) {
        TokenApi.getApiAccessToken({
          apiKey,
          apiSecret,
        })
          .then((apiAccessToken) => {
            expect(apiAccessToken).toBeDefined();

            let apiAccessTokenParts = apiAccessToken.split('.');
            expect(apiAccessTokenParts.length).toBe(3);

            expect(apiAccessTokenParts[0]).toMatch(BASE64_URL_ENCODED__RE);
            expect(apiAccessTokenParts[1]).toMatch(BASE64_URL_ENCODED__RE);
            expect(apiAccessTokenParts[2]).toMatch(BASE64_URL_ENCODED__RE);
            done();
          })
      });

    });

  });

});
