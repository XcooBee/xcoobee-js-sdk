import XcooBeeError from '../core/XcooBeeError';

import ApiUtils from './ApiUtils';

/**
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {Object} eventsMapping - A mapping between event subscription type and
 *   handler.
 * @param {CampaignId} campaignId - The campaign cursor.
 *
 * @returns {Promise<EventSubscription[]>}
 */
export function addEventSubscription(apiAccessToken, eventsMapping, campaignId) {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  let events = [];

  for (let type in eventsMapping) {
    let handler = eventsMapping[type];
    let event_type = toEventType(type);
    events.push({
      handler,
      event_type,
    });
  }
  const addSubscriptionsConfig = {
    campaign_cursor: campaignId,
    events: events,
  };
  const mutation = `
    mutation addEventSubscription($config: AddSubscriptionsConfig!) {
      add_event_subscriptions(config: $config) {
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
  return ApiUtils.createClient(apiAccessToken).request(mutation, {
    config: addSubscriptionsConfig,
  })
    .then((response) => {
      const { add_event_subscriptions } = response;
      const { data } = add_event_subscriptions;

      // TODO: What is page_info doing on the above mutation?

      // TODO: Should we be requesting page_info for this query? Find out what to do
      // with the page_info.  If page_info.has_next_page is true, then do more
      // requests need to be made for more data?

      return Promise.resolve(data);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

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

const TypeToEventTypeLut = {
  BreachBeeUsed: 'breach_bee_used',
  BreachPresented: 'breach_presented',
  ConsentApproved: 'consent_approved',
  ConsentChanged: 'consent_changed',
  ConsentDeclined: 'consent_declined',
  ConsentExpired: 'consent_expired',
  ConsentNearExpiration: 'consent_near_expiration',
  DataApproved: 'data_approved',
  DataChanged: 'data_changed',
  DataDeclined: 'data_declined',
  DataExpired: 'data_expired',
  DataNearExpiration: 'data_near_expiration',
  UserDataRequest: 'user_data_request',
  UserMessage: 'user_message',
  // ?: 'bee_success',
  // ?: 'bee_error',
  // ?: 'process_success',
  // ?: 'process_error',
  // ?: 'process_file_delivered',
  // ?: 'process_file_presented',
  // ?: 'process_file_downloaded',
  // ?: 'process_file_deleted',
  // ?: 'process_reroute',
};

function toEventType(type) {
  if (!(type in TypeToEventTypeLut)) {
    throw new XcooBeeError(`Invalid event type provided: "${type}".`);
  }
  let eventType = TypeToEventTypeLut[type];
  return eventType;
}

export default {
  addEventSubscription,
  listEventSubscriptions,
};
