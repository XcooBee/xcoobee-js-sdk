const Config = require('../../../../../src/xcoobee/sdk/Config');

describe('Config', () => {

  describe('constructor', () => {

    describe('called with valid data', () => {

      it('should result in the expected config instance', () => {
        let config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
          campaignId: null,
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
          campaignId: 'xxxxxx-xxxx-xxxx-xxxxxxx',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBe('xxxxxx-xxxx-xxxx-xxxxxxx');
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
          encrypt: false,
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBeNull();
        expect(config.pgpSecret).toBeNull();


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
          encrypt: true,
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(true);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');


        // Okay to have PGP info when encrypt is false.
        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');

        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
          encrypt: false,
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBeNull();
        expect(config.encrypt).toBe(false);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');


        config = new Config({
          apiKey: 'testApiKey',
          apiSecret: 'testApiSecret',
          apiUrlRoot: 'https://api.xcoobee.net',
          campaignId: 'xxxxxx-xxxx-xxxx-xxxxxxx',
          encrypt: true,
          pgpPassword: 'testPgpPassword',
          pgpSecret: 'testPgpSecret',
        });

        expect(config).toBeInstanceOf(Config);
        expect(config.apiKey).toBe('testApiKey');
        expect(config.apiSecret).toBe('testApiSecret');
        expect(config.apiUrlRoot).toBe('https://api.xcoobee.net');
        expect(config.campaignId).toBe('xxxxxx-xxxx-xxxx-xxxxxxx');
        expect(config.encrypt).toBe(true);
        expect(config.pgpPassword).toBe('testPgpPassword');
        expect(config.pgpSecret).toBe('testPgpSecret');
      });

    });

    describe('called with no API key', () => {

      it('should throw a `TypeError`', () => {
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
    describe('called with no API secret', () => {

      it('should throw a `TypeError`', () => {
      });

    });

    // TODO: assert that apiSecret is required.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

    // TODO: assert that apiSecret must appear to be a valid API secret.
    describe('called with no ', () => {

      it('should ...', () => {
      });

    });

    // TODO: Assert that campaignId defaults to null.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

    // TODO: Assert that campaignId must be null or a non-empty string.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

    // TODO: Assert that encrypt defaults to false.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

    // TODO: Assert that encrypt must be a boolean.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

    // TODO: Assert that pgpPassword defaults to null.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

    // TODO: Assert that pgpSecret defaults to null.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

    // TODO: Assert that pgpPassword and pgpSecret are required when encrypt is
    // true.
    describe('called with ...', () => {

      it('should ...', () => {
      });

    });

  });

});
