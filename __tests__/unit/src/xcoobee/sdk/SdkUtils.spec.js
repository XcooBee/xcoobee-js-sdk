import SdkUtils from '../../../../../src/xcoobee/sdk/SdkUtils';

describe('SdkUtils', function () {

  describe('.resolveApiCfg', function () {

    const defaultConfig = {
      apiKey: 'default-api-key',
      apiSecret: 'default-api-secret',
      apiUrlRoot: 'https://default.api.xcoobee.net',
      mayHaveOther: 'NameValuePairs',
    };

    const overridingConfig = {
      apiKey: 'overriding-api-key',
      apiSecret: 'overriding-api-secret',
      apiUrlRoot: 'https://overriding.api.xcoobee.net',
      mayHaveOther: 'NameValuePairs',
    };

    describe('called with a valid overriding config and a valid default config', function () {

      it('should return an API cfg using the overriding config', function () {
        let apiCfg = SdkUtils.resolveApiCfg(overridingConfig, defaultConfig);
        expect(apiCfg).toBeDefined();
        expect(apiCfg.apiKey).toBe('overriding-api-key');
        expect(apiCfg.apiSecret).toBe('overriding-api-secret');
        expect(apiCfg.apiUrlRoot).toBe('https://overriding.api.xcoobee.net');
      });

    });// eo describe

    describe('called with no overriding config and a valid default config', function () {

      it('should return an API cfg using the default config', function () {
        let apiCfg = SdkUtils.resolveApiCfg(null, defaultConfig);
        expect(apiCfg).toBeDefined();
        expect(apiCfg.apiKey).toBe('default-api-key');
        expect(apiCfg.apiSecret).toBe('default-api-secret');
        expect(apiCfg.apiUrlRoot).toBe('https://default.api.xcoobee.net');

        apiCfg = SdkUtils.resolveApiCfg(undefined, defaultConfig);
        expect(apiCfg).toBeDefined();
        expect(apiCfg.apiKey).toBe('default-api-key');
        expect(apiCfg.apiSecret).toBe('default-api-secret');
        expect(apiCfg.apiUrlRoot).toBe('https://default.api.xcoobee.net');
      });

    });// eo describe

    describe('called with no overriding config and no default config', function () {

      it('should return `null`', function () {
        let apiCfg = SdkUtils.resolveApiCfg(null, null);
        expect(apiCfg).toBeNull();

        apiCfg = SdkUtils.resolveApiCfg(null, undefined);
        expect(apiCfg).toBeNull();

        apiCfg = SdkUtils.resolveApiCfg(null);
        expect(apiCfg).toBeNull();

        apiCfg = SdkUtils.resolveApiCfg(undefined, null);
        expect(apiCfg).toBeNull();

        apiCfg = SdkUtils.resolveApiCfg(undefined, undefined);
        expect(apiCfg).toBeNull();

        apiCfg = SdkUtils.resolveApiCfg(undefined);
        expect(apiCfg).toBeNull();

        apiCfg = SdkUtils.resolveApiCfg();
        expect(apiCfg).toBeNull();
      });

    });// eo describe

  });// eo describe('.resolveApiCfg')

  describe('.resolveCampaignId', function () {

    const defaultConfig = {
      apiKey: 'default-api-key',
      apiSecret: 'default-api-secret',
      apiUrlRoot: 'https://default.api.xcoobee.net',
      campaignId: 'default-campaign-id',
      mayHaveOther: 'NameValuePairs',
    };

    const overridingConfig = {
      apiKey: 'overriding-api-key',
      apiSecret: 'overriding-api-secret',
      apiUrlRoot: 'https://overriding.api.xcoobee.net',
      campaignId: 'overriding-campaign-id',
      mayHaveOther: 'NameValuePairs',
    };

    describe('called with a campaign ID, a valid overriding config, and a valid default config', function () {

      it('should return the campaign ID', function () {
        let campaignId = 'some-valid-campaign-id';
        campaignId = SdkUtils.resolveCampaignId(campaignId, overridingConfig, defaultConfig);
        expect(campaignId).toBe('some-valid-campaign-id');
      });

    });// eo describe

    describe('called with no campaign ID, a valid overriding config, and a valid default config', function () {

      it('should return the campaign overriding ID', function () {
        let campaignId = SdkUtils.resolveCampaignId(null, overridingConfig, defaultConfig);
        expect(campaignId).toBe('overriding-campaign-id');

        campaignId = SdkUtils.resolveCampaignId(undefined, overridingConfig, defaultConfig);
        expect(campaignId).toBe('overriding-campaign-id');
      });

    });// eo describe

    describe('called with no campaign ID, no overriding config, but a valid default config', function () {

      it('should return the campaign overriding ID', function () {
        let campaignId = SdkUtils.resolveCampaignId(null, null, defaultConfig);
        expect(campaignId).toBe('default-campaign-id');

        campaignId = SdkUtils.resolveCampaignId(undefined, null, defaultConfig);
        expect(campaignId).toBe('default-campaign-id');

        campaignId = SdkUtils.resolveCampaignId(null, undefined, defaultConfig);
        expect(campaignId).toBe('default-campaign-id');

        campaignId = SdkUtils.resolveCampaignId(undefined, undefined, defaultConfig);
        expect(campaignId).toBe('default-campaign-id');
      });

    });// eo describe

    describe('called with no campaign ID, no overriding config, and no valid default config', function () {

      it('should return `null`', function () {
        let campaignId = SdkUtils.resolveCampaignId(null, null, null);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(undefined, null, null);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(null, undefined, null);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(null, null, undefined);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(null, null);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(undefined, undefined, null);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(null, undefined, undefined);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(null, undefined);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(null);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(undefined, null, undefined);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(undefined, null);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(undefined, undefined, undefined);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(undefined, undefined);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId(undefined);
        expect(campaignId).toBeNull();

        campaignId = SdkUtils.resolveCampaignId();
        expect(campaignId).toBeNull();
      });

    });// eo describe

  });// eo describe('.resolveCampaignId')

  describe('.resolveSdkCfg', function () {

    const defaultConfig = {
      apiKey: 'default-api-key',
      apiSecret: 'default-api-secret',
      apiUrlRoot: 'https://default.api.xcoobee.net',
      mayHaveOther: 'NameValuePairs',
      pgpPassword: 'default_asdf1234',
      pgpSecret: '-----BEGIN PGP PRIVATE KEY BLOCK-----\ndefault...',
    };

    const overridingConfig = {
      apiKey: 'overriding-api-key',
      apiSecret: 'overriding-api-secret',
      apiUrlRoot: 'https://overriding.api.xcoobee.net',
      mayHaveOther: 'NameValuePairs',
      pgpPassword: 'overriding_asdf1234',
      pgpSecret: '-----BEGIN PGP PRIVATE KEY BLOCK-----\noverriding...',
    };

    describe('called with a valid overriding config and a valid default config', function () {

      it('should return an SDK cfg using the overriding config', function () {
        let sdkCfg = SdkUtils.resolveSdkCfg(overridingConfig, defaultConfig);
        expect(sdkCfg).toBeDefined();
        expect(sdkCfg.apiKey).toBe('overriding-api-key');
        expect(sdkCfg.apiSecret).toBe('overriding-api-secret');
        expect(sdkCfg.apiUrlRoot).toBe('https://overriding.api.xcoobee.net');
        expect(sdkCfg.pgpPassword).toBe('overriding_asdf1234');
        expect(sdkCfg.pgpSecret).toBe('-----BEGIN PGP PRIVATE KEY BLOCK-----\noverriding...');
      });

    });// eo describe

    describe('called with no overriding config and a valid default config', function () {

      it('should return an SDK cfg using the default config', function () {
        let sdkCfg = SdkUtils.resolveSdkCfg(null, defaultConfig);
        expect(sdkCfg).toBeDefined();
        expect(sdkCfg.apiKey).toBe('default-api-key');
        expect(sdkCfg.apiSecret).toBe('default-api-secret');
        expect(sdkCfg.apiUrlRoot).toBe('https://default.api.xcoobee.net');
        expect(sdkCfg.pgpPassword).toBe('default_asdf1234');
        expect(sdkCfg.pgpSecret).toBe('-----BEGIN PGP PRIVATE KEY BLOCK-----\ndefault...');

        sdkCfg = SdkUtils.resolveSdkCfg(undefined, defaultConfig);
        expect(sdkCfg).toBeDefined();
        expect(sdkCfg.apiKey).toBe('default-api-key');
        expect(sdkCfg.apiSecret).toBe('default-api-secret');
        expect(sdkCfg.apiUrlRoot).toBe('https://default.api.xcoobee.net');
        expect(sdkCfg.pgpPassword).toBe('default_asdf1234');
        expect(sdkCfg.pgpSecret).toBe('-----BEGIN PGP PRIVATE KEY BLOCK-----\ndefault...');
      });

    });// eo describe

    describe('called with no overriding config and no default config', function () {

      it('should return `null`', function () {
        let sdkCfg = SdkUtils.resolveSdkCfg(null, null);
        expect(sdkCfg).toBeNull();

        sdkCfg = SdkUtils.resolveSdkCfg(null, undefined);
        expect(sdkCfg).toBeNull();

        sdkCfg = SdkUtils.resolveSdkCfg(null);
        expect(sdkCfg).toBeNull();

        sdkCfg = SdkUtils.resolveSdkCfg(undefined, null);
        expect(sdkCfg).toBeNull();

        sdkCfg = SdkUtils.resolveSdkCfg(undefined, undefined);
        expect(sdkCfg).toBeNull();

        sdkCfg = SdkUtils.resolveSdkCfg(undefined);
        expect(sdkCfg).toBeNull();

        sdkCfg = SdkUtils.resolveSdkCfg();
        expect(sdkCfg).toBeNull();
      });

    });// eo describe

  });// eo describe('.resolveSdkCfg')

});// eo describe('SdkUtils')
