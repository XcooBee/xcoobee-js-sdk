import EndPointApi from '../../../../../src/xcoobee/api/EndPointApi';
import TokenApi from '../../../../../src/xcoobee/api/TokenApi';
import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('EndPointApi', function () {

  describe('.outbox_endpoints', function () {

    describe('called with a valid API access token', function () {

      describe('and called with a known user ID', function () {

        it('should return the user\'s outbox endpoints', function (done) {
          TokenApi.getApiAccessToken({
            apiKey,
            apiSecret,
          })
            .then((apiAccessToken) => {
              const userId = 'known'; // FIXME: TODO: Get a legit user ID.
              EndPointApi.outbox_endpoints(apiAccessToken, userId)
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
              const userCursor = 'unknown';
              EndPointApi.outbox_endpoints(apiAccessToken, userCursor)
                .then(() => {
                  // This should not be called.
                  expect(true).toBe(false);
                })
                .catch((err) => {
                  expect(err).toBeInstanceOf(XcooBeeError);
                  expect(err.message).toBe('Wrong key at line: 3, column: 7');
                  expect(err.name).toBe('XcooBeeError');
                  done();
                });
            });
        });

      });

    });

  });

});
