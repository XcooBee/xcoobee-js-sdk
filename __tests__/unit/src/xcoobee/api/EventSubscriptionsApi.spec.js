const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const {
  addEventSubscription,
  deleteEventSubscription,
  listEventSubscriptions,
} = require('../../../../../src/xcoobee/api/EventSubscriptionsApi');

describe('EventSubscriptionsApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('addEventSubscription', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ add_event_subscriptions: true }));

      const events = {
        ConsentApproved: 'consent_approved_handler',
        ConsentChanged: 'consent_changed_handler',
      };

      return addEventSubscription('apiUrlRoot', 'accessToken', events, 'campaignId')
        .then((res) => {
          expect(res).toBeTruthy();

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.campaign_cursor).toBe('campaignId');

          expect(options.config.events.length).toBe(2);
          expect(options.config.events[0].handler).toBe('consent_approved_handler');
          expect(options.config.events[0].event_type).toBe('consent_approved');
          expect(options.config.events[1].handler).toBe('consent_changed_handler');
          expect(options.config.events[1].event_type).toBe('consent_changed');
        });
    });

    it('should throw an error if invalid event type given', () => {
      const events = { InvalidType: 'handler' };

      try {
        addEventSubscription('apiUrlRoot', 'accessToken', events, 'campaignId');
      } catch (e) {
        expect(e).toBeInstanceOf(XcooBeeError);
        expect(e.message).toBe('Invalid event type provided: "InvalidType".');
        expect(e.name).toBe('XcooBeeError');
      }
    });

  });

  describe('deleteEventSubscription', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ delete_event_subscriptions: true }));

      const events = {
        ConsentApproved: 'consent_approved_handler',
        ConsentChanged: 'consent_changed_handler',
      };

      return deleteEventSubscription('apiUrlRoot', 'accessToken', events, 'campaignId')
        .then((res) => {
          expect(res).toBeTruthy();
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.config.campaign_cursor).toBe('campaignId');

          expect(options.config.events.length).toBe(2);
          expect(options.config.events[0]).toBe('consent_approved');
          expect(options.config.events[1]).toBe('consent_changed');
        });
    });

    it('should throw an error if invalid event type given', () => {
      const events = { InvalidType: 'handler' };

      try {
        deleteEventSubscription('apiUrlRoot', 'accessToken', events, 'campaignId');
      } catch (e) {
        expect(e).toBeInstanceOf(XcooBeeError);
        expect(e.message).toBe('Invalid event type provided: "InvalidType".');
        expect(e.name).toBe('XcooBeeError');
      }
    });

  });

  describe('listEventSubscriptions', () => {

    it('should call graphql endpoint with params', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ event_subscriptions: { data: 'eventSubscriptionData' } }));

      return listEventSubscriptions('apiUrlRoot', 'accessToken', 'campaignId')
        .then((res) => {
          expect(res.data).toBe('eventSubscriptionData');
          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);

          const options = GraphQLClient.prototype.request.mock.calls[0][1];
          expect(options.campaignId).toBe('campaignId');
        });
    });

  });

});
