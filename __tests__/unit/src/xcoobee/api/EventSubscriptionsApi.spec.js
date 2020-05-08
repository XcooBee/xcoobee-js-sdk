const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const {
  addEventSubscriptions,
  deleteEventSubscriptions,
  listEventSubscriptions,
  getAvailableSubscriptions,
  unsuspendEventSubscription,
} = require('../../../../../src/xcoobee/api/EventSubscriptionsApi');

describe('EventSubscriptionsApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('addEventSubscriptions', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ add_event_subscriptions: true }));

      const events = [
        {
          topic: 'campaign:123.qwerty/consent_approved',
          channel: 'webhook',
          handler: 'consent_approved_handler',
        },
        {
          topic: 'campaign:123.qwerty/consent_changed',
          channel: 'webhook',
          handler: 'consent_changed_handler',
        },
      ];

      return addEventSubscriptions('apiUrlRoot', 'accessToken', events)
        .then((res) => {
          expect(res).toBeTruthy();

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.events.length).toBe(2);
          expect(options.config.events[0].topic).toBe('campaign:123.qwerty/consent_approved');
          expect(options.config.events[0].channel).toBe('webhook');
          expect(options.config.events[0].handler).toBe('consent_approved_handler');
          expect(options.config.events[1].topic).toBe('campaign:123.qwerty/consent_changed');
          expect(options.config.events[1].channel).toBe('webhook');
          expect(options.config.events[1].handler).toBe('consent_changed_handler');
        });
    });

    it('should throw an error if no topic or channel provided', () => {
      const events = [
        {
          topic: 'campaign:123.qwerty/consent_approved',
          handler: 'consent_approved_handler',
        },
      ];

      try {
        addEventSubscriptions('apiUrlRoot', 'accessToken', events);
      } catch (e) {
        expect(e).toBeInstanceOf(XcooBeeError);
        expect(e.message).toBe('No topic or channel provided');
      }
    });

  });

  describe('deleteEventSubscriptions', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ delete_event_subscriptions: true }));

      const events = [
        {
          topic: 'campaign:123.qwerty/consent_approved',
          channel: 'webhook',
        },
        {
          topic: 'campaign:123.qwerty/consent_changed',
          channel: 'webhook',
        },
      ];

      return deleteEventSubscriptions('apiUrlRoot', 'accessToken', events)
        .then((res) => {
          expect(res).toBeTruthy();
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];

          expect(options.config.events.length).toBe(2);
          expect(options.config.events.length).toBe(2);
          expect(options.config.events[0].topic).toBe('campaign:123.qwerty/consent_approved');
          expect(options.config.events[0].channel).toBe('webhook');
          expect(options.config.events[1].topic).toBe('campaign:123.qwerty/consent_changed');
          expect(options.config.events[1].channel).toBe('webhook');
        });
    });

    it('should throw an error if invalid event type given', () => {
      const events = [
        {
          topic: 'campaign:123.qwerty/consent_approved',
        },
      ];

      try {
        deleteEventSubscriptions('apiUrlRoot', 'accessToken', events);
      } catch (e) {
        expect(e).toBeInstanceOf(XcooBeeError);
        expect(e.message).toBe('No topic or channel provided');
      }
    });

  });

  describe('listEventSubscriptions', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ event_subscriptions: { data: 'eventSubscriptionData' } }));

      return listEventSubscriptions('apiUrlRoot', 'accessToken', 'campaignId', 'campaign')
        .then((res) => {
          expect(res.data).toBe('eventSubscriptionData');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];

          expect(options.referenceId).toBe('campaignId');
          expect(options.referenceType).toBe('campaign');
        });
    });

  });

  describe('getAvailableSubscriptions', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ available_subscriptions: [] }));

      return getAvailableSubscriptions('apiUrlRoot', 'accessToken', 'campaignId', 'campaign')
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];

          expect(options.referenceId).toBe('campaignId');
          expect(options.referenceType).toBe('campaign');
        });
    });

  });

  describe('unsuspendEventSubscription', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ edit_event_subscription: true }));

      return unsuspendEventSubscription('apiUrlRoot', 'accessToken', 'campaign:123.qwerty/consent_approved', 'webhook')
        .then((res) => {
          expect(res).toBe(true);
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];

          expect(options.config.topic).toBe('campaign:123.qwerty/consent_approved');
          expect(options.config.channel).toBe('webhook');
        });
    });

  });

});
