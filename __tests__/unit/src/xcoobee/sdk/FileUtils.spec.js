const jest = require('jest');

jest.mock('../../../../../src/xcoobee/api/EndPointUtils');
jest.mock('../../../../../src/xcoobee/api/FileApi');
jest.mock('../../../../../src/xcoobee/api/PolicyApi');

const EndPointUtils = require('../../../../../src/xcoobee/api/EndPointUtils');
const FileApi = require('../../../../../src/xcoobee/api/FileApi');
const PolicyApi = require('../../../../../src/xcoobee/api/PolicyApi');
const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const { upload } = require('../../../../../src/xcoobee/sdk/FileUtils');

describe('FileUtils', () => {

  describe('upload', () => {

    afterEach(() => {
      EndPointUtils.findEndPoint.mockReset();
      PolicyApi.upload_policy.mockReset();
      FileApi.upload_file.mockReset();
    });

    it('should return Error if unable to get endpoint', () => {
      return upload('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', [])
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Unable to find an endpoint named "outbox" or "flex".');
        });
    });

    it('should successfully upload file', () => {
      EndPointUtils.findEndPoint.mockReturnValue(Promise.resolve({ cursor: 'endpointId' }));
      PolicyApi.upload_policy.mockReturnValue(Promise.resolve(['policy']));
      FileApi.upload_file.mockReturnValue(Promise.resolve());

      return upload('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', ['test.png'])
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(res[0].success).toBeTruthy();
          expect(res[0].file).toBe('test.png');

          expect(EndPointUtils.findEndPoint).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', 'flex');
          expect(PolicyApi.upload_policy).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'outbox', 'endpointId', ['test.png']);
          expect(FileApi.upload_file).toHaveBeenCalledWith('test.png', 'policy');
        });
    });

    it('should fail on uploading file', () => {
      EndPointUtils.findEndPoint.mockReturnValue(Promise.resolve({ cursor: 'endpointId' }));
      PolicyApi.upload_policy.mockReturnValue(Promise.resolve(['policy']));
      FileApi.upload_file.mockReturnValue(Promise.reject(new Error('error')));

      return upload('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', ['test.png'])
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(res[0].success).toBeFalsy();
          expect(res[0].file).toBe('test.png');
          expect(res[0].error.message).toBe('error');

          expect(EndPointUtils.findEndPoint).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', 'flex');
          expect(PolicyApi.upload_policy).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'outbox', 'endpointId', ['test.png']);
          expect(FileApi.upload_file).toHaveBeenCalledWith('test.png', 'policy');
        });
    });

    it('should upload one file of two', () => {
      EndPointUtils.findEndPoint.mockReturnValue(Promise.resolve({ cursor: 'endpointId' }));
      PolicyApi.upload_policy.mockReturnValue(Promise.resolve(['policy1', 'policy2']));
      FileApi.upload_file
        .mockReturnValueOnce(Promise.resolve(Promise.resolve()))
        .mockReturnValueOnce(Promise.resolve(Promise.reject(new Error('error'))));

      return upload('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', ['test.png', 'invalid'])
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(res[0].success).toBeTruthy();
          expect(res[0].file).toBe('test.png');
          expect(res[1].success).toBeFalsy();
          expect(res[1].file).toBe('invalid');
          expect(res[1].error.message).toBe('error');

          expect(EndPointUtils.findEndPoint).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', 'flex');
          expect(PolicyApi.upload_policy).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'outbox', 'endpointId', ['test.png', 'invalid']);

          expect(FileApi.upload_file).toHaveBeenCalledTimes(2);
          expect(FileApi.upload_file).toHaveBeenNthCalledWith(1, 'test.png', 'policy1');
          expect(FileApi.upload_file).toHaveBeenNthCalledWith(2, 'invalid', 'policy2');
        });
    });

  });

});
