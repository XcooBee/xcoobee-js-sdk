import Path from 'path';

import Config from '../../../../../src/xcoobee/sdk/Config';
import ConfigUtils from '../../../../../src/xcoobee/sdk/ConfigUtils';

const assetsPath = Path.join(__dirname, '..', '..', '..', 'assets');

describe('ConfigUtils', function () {

  describe('.createConfigFromFile', function () {

    describe('called with a valid directory and valid config but not PGP info', function () {

      it('should result in the expected config instance', function (done) {
        let promise = ConfigUtils.createFromFile(Path.join(assetsPath, 'xcoobee', 'sdk', 'config', 'valid-config-wo-pgp'));

        expect(promise).toBeInstanceOf(Promise);

        promise.then((config) => {
          expect(config).toBeInstanceOf(Config);
          expect(config.apiKey).toBe('testApiKey');
          expect(config.apiSecret).toBe('testApiSecret');
          expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
          expect(config.campaignId).toBeNull();
          expect(config.encrypt).toBe(false);
          expect(config.pgpPassword).toBeNull();
          expect(config.pgpSecret).toBeNull();
          done();
        });
      });

    });

    describe('called with a valid directory and valid config with comments', function () {

      it('should result in the expected config instance', function (done) {
        let promise = ConfigUtils.createFromFile(Path.join(assetsPath, 'xcoobee', 'sdk', 'config', 'valid-config-w-comments'));

        expect(promise).toBeInstanceOf(Promise);

        promise.then((config) => {
          expect(config).toBeInstanceOf(Config);
          expect(config.apiKey).toBe('testApiKeyWithComments');
          expect(config.apiSecret).toBe('testApiSecretWithComments');
          expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
          expect(config.campaignId).toBeNull();
          expect(config.encrypt).toBe(false);
          expect(config.pgpPassword).toBeNull();
          expect(config.pgpSecret).toBeNull();
          done();
        });
      });

    });

    describe('called with a valid directory and valid config with blank lines', function () {

      it('should result in the expected config instance', function (done) {
        let promise = ConfigUtils.createFromFile(Path.join(assetsPath, 'xcoobee', 'sdk', 'config', 'valid-config-w-blank-lines'));

        expect(promise).toBeInstanceOf(Promise);

        promise.then((config) => {
          expect(config).toBeInstanceOf(Config);
          expect(config.apiKey).toBe('testApiKeyWithBlankLines');
          expect(config.apiSecret).toBe('testApiSecretWithBlankLines');
          expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
          expect(config.campaignId).toBeNull();
          expect(config.encrypt).toBe(false);
          expect(config.pgpPassword).toBeNull();
          expect(config.pgpSecret).toBeNull();
          done();
        });
      });

    });

    describe('called with a directory with no .xcoobee sub-directory', function () {

      it('should not resolve to a config instance', function (done) {
        let promise = ConfigUtils.createFromFile(Path.join(assetsPath, 'xcoobee', 'sdk', 'config', 'directory-w-no-xcoobee'));

        expect(promise).toBeInstanceOf(Promise);

        promise.catch((err) => {
          expect(err.code).toBe('ENOENT');
          done();
        });
      });

    });

    describe('called with a directory containing a .xcoobee sub-directory but no config file', function () {

      it('should not resolve to a config instance', function (done) {
        let promise = ConfigUtils.createFromFile(Path.join(assetsPath, 'xcoobee', 'sdk', 'config', 'directory-w-xcoobee-but-no-config'));

        expect(promise).toBeInstanceOf(Promise);

        promise.catch((err) => {
          expect(err.code).toBe('ENOENT');
          done();
        });
      });

    });

    // TODO: assert that key (aka name) in file with no value results in a null value.
    // TODO: Assert that the pgp.secret file is read.
    // TODO: Assert that a pgpSecret key in config overrides pgp.secret file.
  });

});
