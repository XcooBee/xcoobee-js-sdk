const XcooBeeError = require('../core/XcooBeeError');
const ApiUtils = require('./ApiUtils');

/**
 * An event subscription type.
 *
 * @name EventSubscriptionType
 * @enum {string}
 */

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
};

/**
 * @private
 * @param {string} type
 *
 * @returns {string}
 *
 * @throws {XcooBeeError}
 */
const toEventType = (type) => {
  if (!(type in TypeToEventTypeLut)) {
    throw new XcooBeeError(`Invalid event type provided: "${type}".`);
  }

  return TypeToEventTypeLut[type];
};

/**
 * A summary of an event subscription.
 *
 * @typedef {Object} EventSubscription
 * @property {string} campaign_cursor
 * @property {string} date_c - The creation date in ISO 8601 format.
 * @property {EventSubscriptionType} event_type - The type of the event subscription.
 * @property {string} handler - The name of the method to call when the event is
 *   fired.
 * @property {string} owner_cursor
 */

/**
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {Object} eventsMapping - A mapping between event subscription type and
 *   handler.
 * @param {CampaignId} campaignId - The campaign cursor.
 *
 * @returns {Promise<Object>} - The result.
 * @property {EventSubscription[]} data - A page of the newly added event
 *   subscriptions.
 * @property {null} page_info - The page information which will always be `null` for
 *   this mutation.
 *
 * @throws {XcooBeeError}
 */
const addEventSubscription = (apiUrlRoot, apiAccessToken, eventsMapping, campaignId) => {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const events = [];

  for (let type in eventsMapping) {
    events.push({
      handler: eventsMapping[type],
      event_type: toEventType(type),
    });
  }
  const addSubscriptionsConfig = {
    campaign_cursor: campaignId,
    events,
  };
  const mutation = `
    mutation addEventSubscription($config: AddSubscriptionsConfig!) {
      add_event_subscriptions(config: $config) {
        data {
          campaign_cursor
          date_c
          event_type
          handler
          owner_cursor
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: addSubscriptionsConfig,
  })
    .then((response) => {
      const { add_event_subscriptions } = response;

      // Note: `page_info` should always be `null` for this mutation.

      return add_event_subscriptions;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {Array} arrayOfEventNames - A mapping between event subscription type and
 *   handler.  The handler is not important here.
 * @param {CampaignId} campaignId - The campaign cursor.
 *
 * @returns {Promise<Object>} - The result.
 * @property {number} deleted_number - The number of event subscriptions deleted.
 *
 * @throws {XcooBeeError}
 */
const deleteEventSubscription = (apiUrlRoot, apiAccessToken, arrayOfEventNames, campaignId) => {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);

  const eventTypes = [];
  arrayOfEventNames.forEach((type) => {
    eventTypes.push(toEventType(type));
  });

  const deleteSubscriptionsConfig = {
    campaign_cursor: campaignId,
    events: eventTypes,
  };
  const mutation = `
    mutation deleteEventSubscription($config: DeleteSubscriptionsConfig!) {
      delete_event_subscriptions(config: $config) {
        deleted_number
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: deleteSubscriptionsConfig,
  })
    .then((response) => {
      const { delete_event_subscriptions } = response;

      return delete_event_subscriptions;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches a page of event subscriptions for the given campaign cursor.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {CampaignId} campaignId - The campaign cursor.
 *
 * @returns {Promise<Object>} - The result.
 * @property {EventSubscription[]} data - A page of event subscriptions for the
 *   given campaign cursor.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const listEventSubscriptions = (apiUrlRoot, apiAccessToken, campaignId) => {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const query = `
    query listEventSubscriptions($campaignId: String!) {
      event_subscriptions(campaign_cursor: $campaignId) {
        data {
          campaign_cursor
          date_c
          event_type
          handler
          owner_cursor
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    campaignId,
  })
    .then((response) => {
      const { event_subscriptions } = response;

      // TODO: Remove the following once `event_subscriptions` returns a valid `page_info`
      // property or no longer does cursor-based pagination.
      event_subscriptions.page_info = event_subscriptions.page_info || { end_cursor: null, has_next_page: false };

      // TODO: return valid event type

      return event_subscriptions;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  addEventSubscription,
  deleteEventSubscription,
  listEventSubscriptions,
  toEventType,
};
