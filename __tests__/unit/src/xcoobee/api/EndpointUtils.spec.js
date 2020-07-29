jest.mock('../../../../../src/xcoobee/api/EndPointApi');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const EndPointApi = require('../../../../../src/xcoobee/api/EndPointApi');
const { findEndPoint } = require('../../../../../src/xcoobee/api/EndPointUtils');

describe('EndpointUtils', () => {

  afterEach(() => EndPointApi.outbox_endpoints.mockReset());

  describe('findEndPoint', () => {

    it('should throw an error if no endpoints found', () => {
      EndPointApi.outbox_endpoints.mockReturnValue(Promise.resolve({ data: [{ name: 'test' }] }));

      return findEndPoint('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', 'flex')
        .then(() => expect(false).toBe(true)) // this will newer happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Unable to find an endpoint named outbox or the fallback end point.');
        });
    });

    it('should return found endpoint', () => {
      EndPointApi.outbox_endpoints.mockReturnValue(Promise.resolve({ data: [{ name: 'test' }] }));

      return findEndPoint('apiUrlRoot', 'apiAccessToken', 'userId', 'test')
        .then((endpoint) => expect(endpoint.name).toBe('test'));
    });

    it('should return fallback endpoint', () => {
      EndPointApi.outbox_endpoints.mockReturnValue(Promise.resolve({ data: [{ name: 'test' }] }));

      return findEndPoint('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', 'test')
        .then((endpoint) => expect(endpoint.name).toBe('test'));
    });

  });

});
