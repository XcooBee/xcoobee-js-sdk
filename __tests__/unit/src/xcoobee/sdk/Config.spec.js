import Config from '../../../../../src/xcoobee/sdk/Config';

describe('Config', function () {

  describe('constructor', function () {

    describe('called with valid data', function () {

      it('should result in the expected config instance', function () {
        let config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          campaignId: null,
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          campaignId: 'xxxxxx-xxxx-xxxx-xxxxxxx',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBe('xxxxxx-xxxx-xxxx-xxxxxxx');
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          encrypt: false,
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          encrypt: true,
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(true);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');


        // Okay to have PGP info when encrypt is false.
        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');

        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          encrypt: false,
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          campaignId: 'xxxxxx-xxxx-xxxx-xxxxxxx',
          encrypt: true,
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.campaignId).toBe('xxxxxx-xxxx-xxxx-xxxxxxx');
        expect(config.encrypt).toBe(true);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');
      });

    });

    describe('called with no API key', function () {

      it('should throw a `TypeError`', function () {
        expect(() => {
          new Config();
        }).toThrowError(TypeError);

        expect(() => {
          new Config({});
        }).toThrowError(TypeError);

        expect(() => {
          new Config({
            apiSecret: 'testApiSecret',
          });
        }).toThrowError(TypeError);

        expect(() => {
          new Config({
            apiKey: undefined,
          });
        }).toThrowError(TypeError);

        expect(() => {
          new Config({
            apiKey: undefined,
            apiSecret: 'testApiSecret',
          });
        }).toThrowError(TypeError);

        expect(() => {
          new Config({
            apiKey: null,
          });
        }).toThrowError(TypeError);

        expect(() => {
          new Config({
            apiKey: null,
            apiSecret: 'testApiSecret',
          });
        }).toThrowError(TypeError);

        expect(() => {
          new Config({
            apiKey: '',
          });
        }).toThrowError(TypeError);

        expect(() => {
          new Config({
            apiKey: '',
            apiSecret: 'testApiSecret',
          });
        }).toThrowError(TypeError);
      });

    });

    // TODO: assert that apiKey must appear to be a valid API key.
    describe('called with no API secret', function () {

      it('should throw a `TypeError`', function () {
      });

    });

    // TODO: assert that apiSecret is required.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

    // TODO: assert that apiSecret must appear to be a valid API secret.
    describe('called with no ', function () {

      it('should ...', function () {
      });

    });

    // TODO: Assert that campaignId defaults to null.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

    // TODO: Assert that campaignId must be null or a non-empty string.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

    // TODO: Assert that encrypt defaults to false.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

    // TODO: Assert that encrypt must be a boolean.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

    // TODO: Assert that pgpPassword defaults to null.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

    // TODO: Assert that pgpSecret defaults to null.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

    // TODO: Assert that pgpPassword and pgpSecret are required when encrypt is
    // true.
    describe('called with ...', function () {

      it('should ...', function () {
      });

    });

  });

});
