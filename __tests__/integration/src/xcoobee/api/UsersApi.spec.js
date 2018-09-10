import ApiAccessTokenCache from '../../../../../src/xcoobee/api/ApiAccessTokenCache';
import UsersApi from '../../../../../src/xcoobee/api/UsersApi';

import { assertIsCursorLike } from '../../../../lib/Utils';

const apiUrlRoot = process.env.XCOOBEE__API_URL_ROOT || 'https://testapi.xcoobee.net/Test';
const apiKey = process.env.XCOOBEE__API_KEY;
const apiSecret = process.env.XCOOBEE__API_SECRET;

jest.setTimeout(60000);

describe('UsersApi', function () {

  const apiAccessTokenCache = new ApiAccessTokenCache();

  describe('.getUser', function () {

    describe('called with a valid API access token', function () {

      it('should fetch and return with user info', async function (done) {
        const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
        const userInfo = await UsersApi.getUser(apiUrlRoot, apiAccessToken);
        expect(userInfo).toBeDefined();
        expect('cursor' in userInfo).toBe(true);
        assertIsCursorLike(userInfo.cursor);
        expect('pgp_public_key' in userInfo).toBe(true);
        let expectedPgpPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v2.6.2
Comment: https://openpgpjs.org

xsBNBFt5wSUBCAC/Ra2PYG8ayfjvizHnmIHz1u+7bGXkwU1VjfsEBLNW2upP
BRs8EAh3e29TTxninsGBGiw1tvLK/LP4aMHyOg+TUdCedrXMBfu5ItpCpo+N
hgmlcKYwTkh31sx1vQvOzqyc/e/fGN57FN4e2k+KI20Hd89p5Em5+/4LwltI
I5PhXN7dgze73cogaf1/QXIL78OxnuSQOC2F/6yDhqCymuNoNhpTByRqkbhe
2UhaKCHLyoTmS5jbPAyKqUdRZ8eoFVQj1OqTPowsjggJDpO4Mq8BjE6klZnu
mxo4bDdt3Tgm5u2Aibrh1Wl132ytLDxEMqfsSIzncv/77Dh7hqzjsY1JABEB
AAHNOFNES1Rlc3RlciBEZXZlbG9wZXIgPHNka3Rlc3Rlci5kZXZlbG9wZXJA
bWFpbGluYXRvci5uZXQ+wsB1BBABCAApBQJbecEmBgsJBwgDAgkQKThY4lz1
JNYEFQgKAgMWAgECGQECGwMCHgEAAIowB/9K2k5EigEqm3H4lQwsHkusle2r
WBPNBi6AtngtN4lZlLYM1J1qIm2h8djPz5Jo6kthr4/liSSH+yGOoZJgyhhz
v+4vdhOJQ4vLjO7E6g12Gs+I/Z4qmiMunoZZ8GdFZpxMNXIYaSvZg+Fj/fJR
HA1tWgaoWc1ASaN3NtSOLpXB1BZ22OntOyWEIoTlkguX7WkprTu90tWuFp6C
A4ng7RUYQc3DDUAv4X1lXMqngnju6shd5sPUCSK/pUETBeY81r/aiSIjn428
5SEtdoHiqKdtJobKh2K5gzqnLp1TRL88049KwOqcwuEAxQMzkXMwjBZL1eao
WYX1hub9sIJ1vus7zsBNBFt5wSUBCADSmZaDHaHopbRIEXKo9kL5nPkaYmas
hZDLUYMZNkX23wTor8stNLuyuyQb4od8z4KC56vMsTUGhZTDAK1TSwCyzr7W
msUmzlvoqHzbPu+FY8HlWmpD7ZPnJ5JdRFzJPFlxIcDNCoR0lM2JIl3f5Wa2
uVBic2R2J2D1NBHZ98CR8GxyY076ax4tCuQxLJJsbaHaJPbakPIyI6zKh0UM
x4c+AzYpBUI8LmEmNlrJw5orz7dcAgr1Bs2vodKcIBCQfR2FazVHAHhfb3MY
pt4v91ZhZGxRcLr6qD9WWxGOP4phOkzKRK/Ysq+IAN7X1tH2jUyEkXBkfmI1
oZydNU5POksPABEBAAHCwF8EGAEIABMFAlt5wSYJECk4WOJc9STWAhsMAACN
YAf/ahU/3e5Pidkc3rD+N9Q6A4jejmpduTJEtR95EgIBz/VeUfjHae8gXgKn
k0IvBDc74epUz9x3Nzg36DsviHO5wokGs4V96By2SzaFhMPlowJTObqmYY+S
GD7fNrSFWogh4D/+Oe8+fP+nY4f/Z2E7lYA1e1YuwiMhAR0PhJFSlpBqM83F
NJmpxw0MhMQVkBn9UwNUGPT11BknAKcwqWGbG6Z0fH1FdyibmELvMIB1b1Gk
O7+7Frzv4uyYQJaYeHVa4hp1acvuOe20C5tgLmMsgQN6Sug+dZzHCQMoCPyr
uug7XQzjchZ7Sgv5uXYwGPDWpuTx5NPq4WZXXR7DWcTWDA==
=FLHL
-----END PGP PUBLIC KEY BLOCK-----

`;
        expect(userInfo.pgp_public_key).toBe(expectedPgpPublicKey);
        expect('xcoobee_id' in userInfo).toBe(true);

        done();
      });// eo it

    });// eo describe

  });// eo describe('.getUser')

});// eo describe('UsersApi')
