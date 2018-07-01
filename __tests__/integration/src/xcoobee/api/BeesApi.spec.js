import BeesApi from '../../../../../src/xcoobee/api/BeesApi';
import TokenApi from '../../../../../src/xcoobee/api/TokenApi';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('BeesApi', function () {

  describe('.bees', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with an API access token', function (done) {
        TokenApi.getApiAccessToken({
          apiKey,
          apiSecret,
        })
          .then((apiAccessToken) => {
            BeesApi.bees(apiAccessToken, '')
              .then((bees) => {
                expect(bees).toBeDefined();
                expect(bees).toBeInstanceOf(Array);
                expect(bees.length).toBe(0);
                // TODO: Add more expectations.
                done();
              })
          });
      });

    });

  });

});
