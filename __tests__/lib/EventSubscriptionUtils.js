const EventSubscriptionsApi = require('../../src/xcoobee/api/EventSubscriptionsApi');
const XcooBeeError = require('../../src/xcoobee/core/XcooBeeError');

const TypeToEventTypeLut = {
  breach_bee_used: 'BreachBeeUsed',
  breach_presented: 'BreachPresented',
  consent_approved: 'ConsentApproved',
  consent_changed: 'ConsentChanged',
  consent_declined: 'ConsentDeclined',
  consent_expired: 'ConsentExpired',
  consent_near_expiration: 'ConsentNearExpiration',
  data_approved: 'DataApproved',
  data_changed: 'DataChanged',
  data_declined: 'DataDeclined',
  data_expired: 'DataExpired',
  data_near_expiration: 'DataNearExpiration',
  user_data_request: 'UserDataRequest',
  user_message: 'UserMessage',
};

const toEventType = (type) => {
  if (!(type in TypeToEventTypeLut)) {
    throw new XcooBeeError(`Invalid event type provided: "${type}".`);
  }
  const eventType = TypeToEventTypeLut[type];
  return eventType;
};

const addTestEventSubscriptions = async (apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId) => {
  const eventsMapping = {
    ConsentApproved: 'OnConsentApproved',
    DataDeclined: 'OnDataDeclined',
  };
  const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
  await EventSubscriptionsApi.addEventSubscription(apiUrlRoot, apiAccessToken, eventsMapping, campaignId);
};

const deleteAllEventSubscriptions = async (apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId) => {
  const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
  const eventSubscriptionsPage = await EventSubscriptionsApi.listEventSubscriptions(apiUrlRoot, apiAccessToken, campaignId);
  const eventTypes = [];
  eventSubscriptionsPage.data.forEach(async (eventSubscription) => {
    eventTypes.push(toEventType(eventSubscription.event_type));
  });
  await EventSubscriptionsApi.deleteEventSubscription(apiUrlRoot, apiAccessToken, eventTypes, campaignId);
};

module.exports = {
  addTestEventSubscriptions,
  deleteAllEventSubscriptions,
};
