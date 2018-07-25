import ApiUtils from './ApiUtils';

/**
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {CampaignId} campaignId - The campaign cursor.
 *
 * @returns {Promise<EventSubscription[]>}
 */
export function listEventSubscriptions(apiAccessToken, campaignId) {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const query = `
    query listEventSubscriptions($campaignId: String!) {
      event_subscriptions(campaign_cursor: $campaignId) {
        data {
          date_c
          event_type
          handler
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiAccessToken).request(query, {
    campaignId,
  })
    .then((response) => {
      const { event_subscriptions } = response;
      const { data } = event_subscriptions;

      // TODO: Should we be requesting page_info for this query? Find out what to do
      // with the page_info.  If page_info.has_next_page is true, then do more
      // requests need to be made for more data?

      return Promise.resolve(data);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  listEventSubscriptions,
};
