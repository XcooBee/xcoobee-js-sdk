const { GraphQLClient } = require('graphql-request');

const ApiUtils = require('../../../../../src/xcoobee/api/ApiUtils');
const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

describe('ApiUtils', () => {

  describe('appearsToBeACursor', () => {

    it('should return true', () => {
      expect(ApiUtils.appearsToBeACursor('CTZamTgKRBUqwaIv/njUF+lcAb4KJDIL1uaaAA==')).toBe(true);
    });

    it('should return false', () => {
      expect(ApiUtils.appearsToBeACursor('CTZamTgKRBUqwaIv/njUF+&&@==')).toBe(false);
    });

  });

  describe('appearsToBeAnEmailAddress', () => {

    it('should return true', () => {
      expect(ApiUtils.appearsToBeAnEmailAddress('a@b.com')).toBe(true);
      expect(ApiUtils.appearsToBeAnEmailAddress('a@a.b.com')).toBe(true);
      expect(ApiUtils.appearsToBeAnEmailAddress('a@a.b.com')).toBe(true);
      expect(ApiUtils.appearsToBeAnEmailAddress('a.b@c.de')).toBe(true);
      expect(ApiUtils.appearsToBeAnEmailAddress('a.b@c.d.ef')).toBe(true);
      expect(ApiUtils.appearsToBeAnEmailAddress('+.+@a.com')).toBe(true);
      expect(ApiUtils.appearsToBeAnEmailAddress('-.+@a.com')).toBe(true);
      expect(ApiUtils.appearsToBeAnEmailAddress('a@b-c.de')).toBe(true);
    });

  });

  describe('assertAppearsToBeACampaignId', () => {

    it('should not throw an error', () => {
      try {
        ApiUtils.assertAppearsToBeACampaignId('campaignId');
      } catch (e) {
        // this will never happen
        expect(false).toBe(true);
      }
    });

    it('should throw an error', () => {
      try {
        ApiUtils.assertAppearsToBeACampaignId(null);
      } catch (e) {
        expect(e).toBeInstanceOf(XcooBeeError);
        expect(e.message).toBe('Campaign ID is required');
        expect(e.name).toBe('XcooBeeError');
      }
    });

  });

  describe('clientClient', () => {

    it('should create GraphQL client', () => {
      const client = ApiUtils.createClient('url_to_backend', 'access_token');

      expect(client).toBeInstanceOf(GraphQLClient);
      expect(client.url).toBe('url_to_backend/graphql');
      expect(client.options.headers.Authorization).toBe('access_token');
    });

  });

  describe('transformError', () => {

    it('should return back XcooBeeError if passed', () => {
      const xcoobeeError = new XcooBeeError('test');
      const error = ApiUtils.transformError(xcoobeeError);

      expect(error).toBeInstanceOf(XcooBeeError);
      expect(error.message).toBe('test');
      expect(error.name).toBe('XcooBeeError');
    });

    it('should return Unauthorized', () => {
      const inputError = {
        response: {
          status: 401,
        },
      };

      const error = ApiUtils.transformError(inputError);

      expect(error).toBeInstanceOf(XcooBeeError);
      expect(error.message).toBe('401 Unauthorized.  Please make sure your API access token is fresh.');
      expect(error.name).toBe('XcooBeeError');
    });

    it('should format messages', () => {
      const inputError = {
        response: {
          status: 400,
          errors: [
            { message: 'error1' },
            { message: 'error2' },
          ],
        },
      };

      const error = ApiUtils.transformError(inputError);

      expect(error).toBeInstanceOf(XcooBeeError);
      expect(error.message).toBe('error1\nerror2');
      expect(error.name).toBe('XcooBeeError');
    });

    it('should format messages with locations', () => {
      const inputError = {
        response: {
          status: 400,
          errors: [
            { message: 'error1', locations: [{ line: 1, column: 1 }] },
            { message: 'error2', locations: [{ line: 1, column: 1 }, { line: 2, column: 1 }] },
          ],
        },
      };

      const error = ApiUtils.transformError(inputError);

      expect(error).toBeInstanceOf(XcooBeeError);
      expect(error.message).toBe('error1 at line: 1, column: 1\nerror2 at line: 1, column: 1, at line: 2, column: 1');
      expect(error.name).toBe('XcooBeeError');
    });

    it('should format messages and stringify error object', () => {
      const inputError = {
        response: {
          status: 400,
          errors: [
            { error_message: 'error1' },
          ],
        },
      };

      const error = ApiUtils.transformError(inputError);

      expect(error).toBeInstanceOf(XcooBeeError);
      expect(error.message).toBe('{"error_message":"error1"}');
      expect(error.name).toBe('XcooBeeError');
    });

    it('should format response with single error message', () => {
      const inputError = {
        response: {
          status: 400,
          errors: { message: 'error' },
        },
      };

      const error = ApiUtils.transformError(inputError);

      expect(error).toBeInstanceOf(XcooBeeError);
      expect(error.message).toBe('error');
      expect(error.name).toBe('XcooBeeError');
    });

    it('should wrap string to XcooBeeError', () => {
      const error = ApiUtils.transformError('error');

      expect(error).toBeInstanceOf(XcooBeeError);
      expect(error.message).toBe('error');
      expect(error.name).toBe('XcooBeeError');
    });

  });

});// eo describe('ApiUtils')
