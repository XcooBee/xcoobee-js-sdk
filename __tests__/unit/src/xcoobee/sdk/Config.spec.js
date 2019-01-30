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

  });

});
