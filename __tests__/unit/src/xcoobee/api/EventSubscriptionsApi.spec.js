const sinon = require('sinon');
const { GraphQLClient } = require('graphql-request');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const {
  addEventSubscription,
  deleteEventSubscription,
  listEventSubscriptions,
} = require('../../../../../src/xcoobee/api/EventSubscriptionsApi');

describe('EventSubscriptionsApi', () => {

  afterEach(() => sinon.restore());

  describe('addEventSubscription', () => {

    it('should call graphql endpoint with params', () => {
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ add_event_subscriptions: true }));

      const events = {
        ConsentApproved: 'consent_approved_handler',
        ConsentChanged: 'consent_changed_handler',
      };

      return addEventSubscription('apiUrlRoot', 'accessToken', events, 'campaignId')
        .then((res) => {
          expect(res).toBeTruthy();
          expect(stub.calledOnce).toBeTruthy();

          const options = stub.getCall(0).args[1];
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
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ delete_event_subscriptions: true }));

      const events = {
        ConsentApproved: 'consent_approved_handler',
        ConsentChanged: 'consent_changed_handler',
      };

      return deleteEventSubscription('apiUrlRoot', 'accessToken', events, 'campaignId')
        .then((res) => {
          expect(res).toBeTruthy();
          expect(stub.calledOnce).toBeTruthy();

          const options = stub.getCall(0).args[1];
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
      const stub = sinon.stub(GraphQLClient.prototype, 'request').returns(Promise.resolve({ event_subscriptions: { data: 'eventSubscriptionData' } }));

      return listEventSubscriptions('apiUrlRoot', 'accessToken', 'campaignId')
        .then((res) => {
          expect(res.data).toBe('eventSubscriptionData');
          expect(stub.calledOnce).toBeTruthy();

          const options = stub.getCall(0).args[1];
          expect(options.campaignId).toBe('campaignId');
        });
    });

  });

});
