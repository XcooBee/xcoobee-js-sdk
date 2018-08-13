/**
 *
 * @param {Config} overridingConfig
 * @param {Config} defaultConfig
 */
function resolveApiCfg(overridingConfig, defaultConfig) {
  if (
    overridingConfig &&
    'apiKey' in overridingConfig &&
    'apiSecret' in overridingConfig &&
    'apiUrlRoot' in overridingConfig
  ) {
    return {
      apiKey: overridingConfig.apiKey,
      apiSecret: overridingConfig.apiSecret,
      apiUrlRoot: overridingConfig.apiUrlRoot,
    };
  }
  if (
    defaultConfig &&
    'apiKey' in defaultConfig &&
    'apiSecret' in defaultConfig &&
    'apiUrlRoot' in defaultConfig
  ) {
    return {
      apiKey: defaultConfig.apiKey,
      apiSecret: defaultConfig.apiSecret,
      apiUrlRoot: defaultConfig.apiUrlRoot,
    };
  }
  return null;
}

/**
 * Resolves
 * @param {string} [campaignId]
 * @param {Config} [overridingConfig]
 * @param {Config} [defaultConfig]
 */
function resolveCampaignId(campaignId, overridingConfig, defaultConfig) {
  if (campaignId && typeof campaignId === 'string') {
    return campaignId;
  }
  if (overridingConfig && typeof overridingConfig.campaignId === 'string') {
    return overridingConfig.campaignId;
  }
  if (defaultConfig && typeof defaultConfig.campaignId === 'string') {
    return defaultConfig.campaignId;
  }
  return null;
}

export default {
  resolveApiCfg,
  resolveCampaignId,
};
