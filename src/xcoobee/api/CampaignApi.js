const ApiUtils = require('./ApiUtils');
const XcooBeeError = require('../core/XcooBeeError');

/**
 * Fetches the campaign information for the given campaign ID.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {CampaignId} campaignId - The campaign ID.
 *
 * @returns {Promise<Object>} - The result.
 * @property {CampaignInfo} campaign - The campaign information.
 *
 * @throws {XcooBeeError}
 */
const getCampaignInfo = (apiUrlRoot, apiAccessToken, campaignId) => {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const query = `
    query getCampaignInfo($campaignId: String!) {
      campaign(campaign_cursor: $campaignId) {
        campaign_description {
          text
        }
        campaign_name
        campaign_cursor
        campaign_reference
        campaign_title {
          text
        }
        date_c
        date_e
        endpoint
        status
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    campaignId,
  })
    .then((response) => {
      const { campaign } = response;

      return { campaign };
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetch a page of campaigns.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} userCursor
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>} - A page of campaigns.
 * @property {Campaign[]} data - Campaigns for this page.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const getCampaigns = (apiUrlRoot, apiAccessToken, userCursor, after = null, first = null) => {
  const query = `
    query getCampaigns($userCursor: String!, $after: String, $first: Int) {
      campaigns(user_cursor: $userCursor, after: $after, first: $first) {
        data {
          campaign_cursor
          campaign_name
          campaign_reference
          status
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    after,
    first,
    userCursor,
  })
    .then((response) => {
      const { campaigns } = response;

      return campaigns;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches the campaign information for the given campaign ID.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {CampaignRef} campaignRef - The campaign reference.
 *
 * @returns {Promise<string>} - The result.
 * @property {CampaignInfo} campaign - The campaign information.
 *
 * @throws {XcooBeeError}
 */
const getCampaignIdByRef = (apiUrlRoot, apiAccessToken, campaignRef) => {
  const query = `
    query getCampaignId($campaignRef: String!) {
      campaign(campaign_ref: $campaignRef) {
        campaign_cursor
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    campaignRef,
  })
    .then((response) => response.campaign.campaign_cursor)
    .catch(() => ''); // campaign not found
};

/**
 * Fetches the campaign information for the given campaign ID.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {CampaignId} campaignId - The campaign ID.
 *
 * @returns {boolean} - true if campaign exists.
 *
 * @throws {XcooBeeError}
 */
const validateCampaignExists = (apiUrlRoot, apiAccessToken, campaignId) => {
  return getCampaignInfo(apiUrlRoot, apiAccessToken, campaignId)
    .then(({ campaign }) => {
      if (!campaign) {
        throw new XcooBeeError('Campaign not found');
      }

      return true;
    });
};

module.exports = {
  getCampaignInfo,
  getCampaigns,
  getCampaignIdByRef,
  validateCampaignExists,
};
