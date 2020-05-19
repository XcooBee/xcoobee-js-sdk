const ApiUtils = require('./ApiUtils');
const XcooBeeError = require('../core/XcooBeeError');

/**
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {EventSubscription[]} eventSubscriptions - A list of event subscriptions to subscribe.

 *
 * @returns {Promise<Object>} - The result.
 * @property {EventSubscription[]} data - A page of the newly added event
 *   subscriptions.
 * @property {null} page_info - The page information which will always be `null` for
 *   this mutation.
 *
 * @throws {XcooBeeError}
 */
const addEventSubscriptions = (apiUrlRoot, apiAccessToken, eventSubscriptions) => {
  const addSubscriptionsConfig = {
    events: eventSubscriptions.map((eventSubscription) => {
      if (!eventSubscription.topic || !eventSubscription.channel) {
        throw new XcooBeeError('No topic or channel provided');
      }

      return {
        topic: eventSubscription.topic,
        channel: eventSubscription.channel,
        handler: eventSubscription.handler,
      };
    }),
  };
  const mutation = `
    mutation addEventSubscriptions($config: AddSubscriptionsConfig!) {

      add_event_subscriptions(config: $config) {

        data {
            topic
            channel
            handler
            owner_cursor
            reference_cursor
            reference_type
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: addSubscriptionsConfig,
  })
    .then((response) => response.add_event_subscriptions)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {EventSubscription[]} eventSubscriptions - An array of event subscriptions to unsubscribe
 *
 * @returns {Promise<Object>} - The result.
 * @property {number} deleted_number - The number of event subscriptions deleted.
 *
 * @throws {XcooBeeError}
 */
const deleteEventSubscriptions = (apiUrlRoot, apiAccessToken, eventSubscriptions) => {
  const deleteSubscriptionsConfig = {
    events: eventSubscriptions.map((eventSubscription) => {
      if (!eventSubscription.topic || !eventSubscription.channel) {
        throw new XcooBeeError('No topic or channel provided');
      }

      return {
        topic: eventSubscription.topic,
        channel: eventSubscription.channel,
      };
    }),
  };
  const mutation = `
    mutation deleteEventSubscriptions($config: DeleteSubscriptionsConfig!) {
      delete_event_subscriptions(config: $config) {
        deleted_number
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: deleteSubscriptionsConfig,
  })
    .then((response) => response.delete_event_subscriptions)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches event subscriptions for the user.

 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} referenceId - ID of related entity (i.e. campaignId).

 * @param {string} referenceType - type of related entity (i.e. campaign, funding_panel)
 *
 * @returns {Promise<Object>} - The result.
 * @property {EventSubscription[]} data - A page of event subscriptions for the user
 *
 * @throws {XcooBeeError}
 */
const listEventSubscriptions = (apiUrlRoot, apiAccessToken, referenceId, referenceType) => {
  const query = `{
    event_subscriptions {
      data {
        owner_cursor
        reference_cursor
        reference_type
        topic
        channel
        handler
        date_c
      }
    }
  }`;

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    referenceId,
    referenceType,
  })
    .then((response) => response.event_subscriptions)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches available subscriptions and channels for the user
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} referenceId - ID of related entity (i.e. campaignId).
 * @param {string} referenceType - type of related entity (i.e. campaign, funding_panel)
 *
 * @returns {Promise<Array>} - All available subscriptions to subscribe.
 *
 * @throws {XcooBeeError}
 */
const getAvailableSubscriptions = (apiUrlRoot, apiAccessToken, referenceId, referenceType) => {
  const query = `query getAvailableSubscriptions($referenceType: EventReferenceType, $referenceId: String) {

    available_subscriptions (reference_type: $referenceType, reference_cursor: $referenceId) {
      topic
      channels
    }
  }`;

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    referenceId,
    referenceType,
  })
    .then((response) => response.available_subscriptions)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches available subscriptions and channels for the user
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} topic - topic of subscription
 * @param {string} channel - channel of subscription
 *
 * @returns {Promise<Array>} - All available subscriptions to subscribe.
 *
 * @throws {XcooBeeError}
 */
const unsuspendEventSubscription = (apiUrlRoot, apiAccessToken, topic, channel) => {
  const mutation = `mutation unsuspendEventSubscriptions($config: EditSubscriptionConfig!) {
    edit_event_subscription(config: $config) {
        topic
        channel
        status
    }
  }`;

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: {
      topic,
      channel,
    },
  })
    .then((response) => response.edit_event_subscription)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  addEventSubscriptions,
  deleteEventSubscriptions,
  listEventSubscriptions,
  getAvailableSubscriptions,
  unsuspendEventSubscription,
};
