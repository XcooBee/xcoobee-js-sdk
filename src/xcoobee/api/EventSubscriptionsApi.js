import ApiUtils, { createClient } from './ApiUtils';

/**
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {CampaignId} campaignId - The campaign ID.
 *
 * @returns {Promise<EventSubscriptions[]>}
 */
export function listEventSubscriptions(apiAccessToken, campaignId) {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const query = `
    query listEventSubscriptions($campaignId: String!) {
      event_subscriptions(campaign_cursor: $campaignId) {
        data {
          event_type,
          handler,
          date_c
        }
      }
    }
  `;
  return createClient(apiAccessToken).request(query, {
    campaignId,
  })
    .then((response) => {
      const { event_subscriptions } = response;
      const { data } = event_subscriptions;
      // TODO: Transform data if necessary.
      return Promise.resolve(data);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  listEventSubscriptions,
};
