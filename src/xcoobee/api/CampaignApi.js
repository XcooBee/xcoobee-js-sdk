import ApiUtils from './ApiUtils';

/**
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {CampaignId} campaignId - The campaign ID.
 *
 * @returns {CampaignInfo}
 */
export function getCampaignInfo(apiAccessToken, campaignId) {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const query = `
    query getCampaignInfo($campaignId: String!) {
      campaign(campaign_cursor: $campaignId) {
        campaign_name
        date_c
        date_e
        status
        xcoobee_targets {
          xcoobee_id
        }
      }
    }
  `;
  return ApiUtils.createClient(apiAccessToken).request(query, {
    campaignId,
  })
    .then((response) => {
      const { campaign } = response;
      // TODO: Transform data if necessary.
      return Promise.resolve(campaign);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export function getCampaigns(apiAccessToken, userCursor) {
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
    query getCampaigns($userCursor: String!) {
      campaigns(user_cursor: $userCursor) {
        data {
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
  return ApiUtils.createClient(apiAccessToken).request(query, {
    userCursor,
  })
    .then((response) => {
      const { campaigns } = response;
      const { data } = campaigns;

      // TODO: Should we be requesting page_info for this query? Find out what to do
      // with the page_info.  If page_info.has_next_page is true, then do more
      // requests need to be made for more data?

      return Promise.resolve(data);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  getCampaignInfo,
  getCampaigns,
};
