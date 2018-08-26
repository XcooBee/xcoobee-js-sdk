import EventSubscriptionsApi from '../../src/xcoobee/api/EventSubscriptionsApi';

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

function toEventType(type) {
  if (!(type in TypeToEventTypeLut)) {
    throw new XcooBeeError(`Invalid event type provided: "${type}".`);
  }
  let eventType = TypeToEventTypeLut[type];
  return eventType;
}

export async function addTestEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId) {
  const eventsMapping = {
    ConsentApproved: 'OnConsentApproved',
    DataDeclined: 'OnDataDeclined',
  };
  const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
  await EventSubscriptionsApi.addEventSubscription(
    apiUrlRoot, apiAccessToken, eventsMapping, campaignId
  );
}

export async function deleteAllEventSubscriptions(apiAccessTokenCache, apiUrlRoot, apiKey, apiSecret, campaignId) {
  const apiAccessToken = await apiAccessTokenCache.get(apiUrlRoot, apiKey, apiSecret);
  const eventSubscriptionsPage = await EventSubscriptionsApi.listEventSubscriptions(
    apiUrlRoot, apiAccessToken, campaignId
  );
  const eventsMapping = {};
  eventSubscriptionsPage.data.forEach(async (eventSubscription) => {
    eventsMapping[toEventType(eventSubscription.event_type)] = eventSubscription.handler;
  });
  await EventSubscriptionsApi.deleteEventSubscription(
    apiUrlRoot, apiAccessToken, eventsMapping, campaignId
  );
}
