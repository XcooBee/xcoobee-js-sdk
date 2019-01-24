const ApiAccessTokenCache = require('../../../../../src/xcoobee/api/ApiAccessTokenCache');
const UsersApi = require('../../../../../src/xcoobee/api/UsersApi');

const { assertIsCursorLike } = require('../../../../lib/Utils');

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('UsersApi', () => {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.getUser', () => {

    describe('called with a valid API access token', () => {

      it('should fetch and return with user info', async (done) => {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const userInfo = await UsersApi.getUser(apiUrlRoot, apiAccessToken);
        expect(userInfo).toBeDefined();
        expect('cursor' in userInfo).toBe(true);
        assertIsCursorLike(userInfo.cursor);
        expect('pgp_public_key' in userInfo).toBe(true);
        const expectedPgpPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v2.6.2
Comment: https://openpgpjs.org

xsBNBFw34rYBCACWo2IjCSIn7/LmJlAfZUdJFHDTix+DbAz5WhJIPA6I8koP
VeRP2Ez3f5/h38vl8cYoBElMytQi4q7teMw639bbB2veVs9xjn/9nfQJB/af
dgZGfsLUHoTuSfK6TQSxJ0gVfHFZfu6dhjHbZmSmlQNNaiHmYRDfn6qXFH5k
2QYMgfGWm8VgPUcbQAy8nwM4y0O/t+dpbxpMDxkVL+nfZHDp9DjUB2sBLmvy
kdGboN9Ezkrcnd0lxvKXl+k5MfYXfW95xMgae3DWAtdT/6P8lw/LNf6LwAKv
y3299rm6Cjhm98nmLGv2ItOhZ/+002C36CbV7UgunIr2ZMdZc53yMapxABEB
AAHNOFNES1Rlc3RlciBEZXZlbG9wZXIgPHNka3Rlc3Rlci5kZXZlbG9wZXJA
bWFpbGluYXRvci5uZXQ+wsB1BBABCAApBQJcN+K3BgsJBwgDAgkQlIABGdqf
ouwEFQgKAgMWAgECGQECGwMCHgEAAONcB/9C1dQgCUIRs5ZijrEHfIZiLO5Q
OxhBAJXM8eFmkrOPS/NUPeY8IJwPMCb0X0WylEDJC6QZWEsm8UAp/OD1qkNy
XAZ1FuTBYfHwmszdIJm8Gbeh0vPIpjPrS4mWcixt/lBkwSlVexK6kfIiZBaT
B94sHnNBMeSGC44BSh2FnCUkS6FEWzFrfwytP4koe2YgM8JquPGH7opUnA8A
kZQHesZrQSCwsfwpvux/aaRJ6DbeQCoM104K5n+uxnMPAl9uBhI/Zw5abEkZ
tK6HiRdEwJmP8Ihu93p43MOHaDK7heOW+arWs0XgNYLHbqWjN38CR6DH+3+n
aEOaetctJ9k4AtTXzsBNBFw34rYBCACgP0u4XosoxqUPDEF6kYmcM+GF1ZXb
Z+RGYkpETIMg3b4C+aXrQPod5tOqMn0taLipaJc+emuv2ULoNpKw8GIjVu9p
7YKzphrOpih61fBZVfzLrV5gDC/UQgtxZXmtmmYY4Pdy6GBsavBSVNYNl2ET
c0gaL9elTYD1HgdUzxM8hr+BqNRNPFj+el1u++8/z7tCR4O0ILaTVXQzeY9Q
3AtyhLzN0bfh7NQV69ERnD5OdAgvFT7kzlqCKoOG0HFkwBaDedollYGOkxPI
jqoTCwvKWb0PcCvCC8Jg6utQMbk8HjcvmoG/3XTvBdU/JYSYq5hy9BK8Polk
RDjFmS4oGH7jABEBAAHCwF8EGAEIABMFAlw34rgJEJSAARnan6LsAhsMAAA4
wgf/QGzo5QpFYrp5ZPZX7WlVZSp8wRIExZ6EzI/lBSkwLH2J8G3tW53bGmwG
/6ycpSQ81zJeZNLOacFpabi20SxW61bhgBfXHX7ib59h8YDv7b/j/sUz6xHv
KHcJ3HF4TgUtYKtkwH4BF9dAjW76r5kmIGK4RK+6dRT7b3jX052EFOkpS+i0
mmeyQKCVl576I5jpKja1MZpbSEFvxsGCL5rjC5J9kVF6yshV84c9I9olMpyi
KS/z8V1zvDorJG5/qu74casdvWvF05CTkTEemOJGFHrYcbg3KEQVv5hy+dlF
+qFnPWC10gdZl7VlT1PW7Avq5knpVwudUA9yOQQ16US5qg==
=q+qS
-----END PGP PUBLIC KEY BLOCK-----

`;
        expect(userInfo.pgp_public_key).toBe(expectedPgpPublicKey);
        expect('xcoobee_id' in userInfo).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getUser')

});// eo describe('UsersApi')
