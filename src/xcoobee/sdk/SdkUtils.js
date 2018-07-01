
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
  resolveCampaignId,
};
