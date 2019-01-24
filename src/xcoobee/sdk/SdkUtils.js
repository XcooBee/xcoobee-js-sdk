const ErrorResponse = require('./ErrorResponse');
const PagingResponse = require('./PagingResponse');

/**
 * Resolves the API config to use based on given input.
 *
 * @param {Config} [overridingConfig]
 * @param {Config} [defaultConfig]
 *
 * @returns {ApiCfg}
 */
function resolveApiCfg(overridingConfig, defaultConfig) {
  if (overridingConfig
    && 'apiKey' in overridingConfig
    && 'apiSecret' in overridingConfig
    && 'apiUrlRoot' in overridingConfig
  ) {
    return {
      apiKey: overridingConfig.apiKey,
      apiSecret: overridingConfig.apiSecret,
      apiUrlRoot: overridingConfig.apiUrlRoot,
    };
  }
  if (defaultConfig
    && 'apiKey' in defaultConfig
    && 'apiSecret' in defaultConfig
    && 'apiUrlRoot' in defaultConfig
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
 * Resolves the campaign ID to use based on the given input.
 *
 * @param {string} [campaignId]
 * @param {Config} [overridingConfig]
 * @param {Config} [defaultConfig]
 *
 * @returns {string} The resolved campaign ID.
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

/**
 * Resolves the SDK config to use based on given input.
 *
 * @param {Config} [overridingConfig]
 * @param {Config} [defaultConfig]
 *
 * @returns {ApiCfg}
 */
function resolveSdkCfg(overridingConfig, defaultConfig) {
  if (overridingConfig
    && 'apiKey' in overridingConfig
    && 'apiSecret' in overridingConfig
    && 'apiUrlRoot' in overridingConfig
  ) {
    return {
      apiKey: overridingConfig.apiKey,
      apiSecret: overridingConfig.apiSecret,
      apiUrlRoot: overridingConfig.apiUrlRoot,
      pgpPassword: overridingConfig.pgpPassword,
      pgpSecret: overridingConfig.pgpSecret,
    };
  }
  if (defaultConfig
    && 'apiKey' in defaultConfig
    && 'apiSecret' in defaultConfig
    && 'apiUrlRoot' in defaultConfig
  ) {
    return {
      apiKey: defaultConfig.apiKey,
      apiSecret: defaultConfig.apiSecret,
      apiUrlRoot: defaultConfig.apiUrlRoot,
      pgpPassword: defaultConfig.pgpPassword,
      pgpSecret: defaultConfig.pgpSecret,
    };
  }
  return null;
}

/**
 * Starts the paging process.
 *
 * @param {Function} fetchPage - A function that fetches a page of information based
 *   on the API config and the given parameters plus the current `after` and `limit`
 *   parameters.
 * @param {ApiCfg} apiCfg - The API config.
 * @param {Object} params - The static parameters expected by the fetch page
 *   function.
 *
 * @returns {Promise<PagingResponse, ErrorResponse>}
 */
async function startPaging(fetchPage, apiCfg, params) {
  try {
    const firstPage = await fetchPage(apiCfg, { ...params, after: null });
    const response = new PagingResponse(fetchPage, firstPage, apiCfg, params);
    return response;
  } catch (err) {
    throw new ErrorResponse(400, err);
  }
}

module.exports = {
  resolveApiCfg,
  resolveCampaignId,
  resolveSdkCfg,
  startPaging,
};
