const ApiUtils = require('./ApiUtils');

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
        campaign_title {
          text
        }
        date_c
        date_e
        email_targets {
          email
        }
        endpoint
        status
        targets {
          name
          recipient
        }
        xcoobee_targets {
          xcoobee_id
        }
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
  /*
  Available Campaign Data:
    campaign_cursor
    owner_cursor
    campaign_name
    date_c
    date_u
    date_e
    webhook
    webkey
    endpoint
    status
    campaign_title {
      locale
      text
    }
    campaign_description {
      locale
      text
    }
    is_data_campaign
    allow_notes
    restrict_additional_users
    targets {
      recipient
      locale
      contract_ref
      name
    }
    xcoobee_targets {
      xcoobee_id
      contract_ref
    }
    email_targets {
      email
      locale
      contract_ref
    }
    countries
    requests {
      data {
        request_cursor
        request_name
      }
    }
  */
  const query = `
    query getCampaigns($userCursor: String!, $after: String, $first: Int) {
      campaigns(user_cursor: $userCursor, after: $after, first: $first) {
        data {
          campaign_cursor
          campaign_name
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

module.exports = {
  getCampaignInfo,
  getCampaigns,
};
