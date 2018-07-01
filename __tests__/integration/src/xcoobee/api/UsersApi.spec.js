import UsersApi from '../../../../../src/xcoobee/api/UsersApi';
import TokenApi from '../../../../../src/xcoobee/api/TokenApi';

const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('UsersApi', function () {

  describe('.user', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with user info', function (done) {
        TokenApi.getApiAccessToken({
          apiKey,
          apiSecret,
        })
          .then((apiAccessToken) => {
            UsersApi.user(apiAccessToken, '')
              .then((userInfo) => {
                expect(userInfo).toBeDefined();
                expect('cursor' in userInfo).toBe(true);
                expect('pgp_public_key' in userInfo).toBe(true);
                expect('xcoobee_id' in userInfo).toBe(true);
                done();
              })
          });
      });

    });

  });

});
