import SdkUtils from '../../../../../src/xcoobee/sdk/SdkUtils';

describe('SdkUtils', function () {

  describe('.resolveApiCfg', function () {

    const defaultConfig = {
      apiKey: 'default-api-key',
      apiSecret: 'default-api-secret',
      mayHaveOther: 'NameValuePairs',
    };

    const overridingConfig = {
      apiKey: 'overriding-api-key',
      apiSecret: 'overriding-api-secret',
      mayHaveOther: 'NameValuePairs',
    };

    describe('called with a valid overriding config and a valid default config', function () {

      it('should return an API cfg using the overriding config', function () {
        let apiCfg = SdkUtils.resolveApiCfg(overridingConfig, defaultConfig);
        expect(apiCfg).toBeDefined();
        expect(apiCfg.apiKey).toBe('overriding-api-key');
        expect(apiCfg.apiSecret).toBe('overriding-api-secret');
      });

    });// eo describe

    describe('called with no overriding config and a valid default config', function () {

      it('should return an API cfg using the default config', function () {
        let apiCfg = SdkUtils.resolveApiCfg(null, defaultConfig);
        expect(apiCfg).toBeDefined();
        expect(apiCfg.apiKey).toBe('default-api-key');
        expect(apiCfg.apiSecret).toBe('default-api-secret');

        apiCfg = SdkUtils.resolveApiCfg(undefined, defaultConfig);
        expect(apiCfg).toBeDefined();
        expect(apiCfg.apiKey).toBe('default-api-key');
        expect(apiCfg.apiSecret).toBe('default-api-secret');
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
      campaignId: 'default-campaign-id',
      mayHaveOther: 'NameValuePairs',
    };

    const overridingConfig = {
      apiKey: 'overriding-api-key',
      apiSecret: 'overriding-api-secret',
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

});// eo describe('SdkUtils')
