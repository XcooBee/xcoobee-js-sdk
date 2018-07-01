import EndPointApi from '../../../../../src/xcoobee/api/EndPointApi';
import TokenApi from '../../../../../src/xcoobee/api/TokenApi';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EndPointApi', function () {

  describe('.getOutboxEndpoints', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known user ID', function () {

        it('should return the user\'s outbox endpoints', function (done) {
          TokenApi.getApiAccessToken({
            apiKey,
            apiSecret,
          })
            .then((apiAccessToken) => {
              const userId = 'known'; // FIXME: TODO: Get a legit user ID.
              EndPointApi.getOutboxEndpoints(apiAccessToken, userId)
                .then((res) => {
                  console.dir(res);
                  expect(res).toBeDefined();
                  // TODO: Add more expectations.
                  done();
                })
            });
        });

      });

      describe('and called with an unknown user ID', function () {

        it('should return with no data', function (done) {
          TokenApi.getApiAccessToken({
            apiKey,
            apiSecret,
          })
            .then((apiAccessToken) => {
              const userId = 'unknown';
              EndPointApi.getOutboxEndpoints(apiAccessToken, userId)
                .then((res) => {
                  console.dir(res);
                  expect(res).toBeDefined();
                  // TODO: Add more expectations.
                  done();
                })
            });
        });

      });

    });

  });

});
