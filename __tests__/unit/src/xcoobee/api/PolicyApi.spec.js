const jest = require('jest');

jest.mock('graphql-request');

const { GraphQLClient } = require('graphql-request');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const { upload_policy } = require('../../../../../src/xcoobee/api/PolicyApi');

describe('PolicyApi', () => {

  afterEach(() => GraphQLClient.prototype.request.mockReset());

  describe('upload_policy', () => {

    it('sohould return error if intent is invalid', () => {
      try {
        upload_policy('apiUrlRoot', 'accessToken', 'invalid');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('\'intent\' must be one of bee_icon, invite_list, outbox, profile_image.');
      }
    });

    it('sohould return error if endpoin is not cursor', () => {
      try {
        upload_policy('apiUrlRoot', 'accessToken', 'bee_icon', '#@^&%');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('`endPointCursor` is required.');
      }
    });

    it('sohould return error if files is not array', () => {
      try {
        upload_policy('apiUrlRoot', 'accessToken', 'bee_icon', 'iuurtw324jir+gfd43trf/==', 'file.jpg');
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe('`files` must be an array.');
      }
    });

    it('should return error if something went wrong on upload', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.reject('error'));

      return upload_policy('apiUrlRoot', 'accessToken', 'bee_icon', 'iuurtw324jir+gfd43trf/==', ['file.jpg'])
        .then(() => expect(false).toBe(true)) // this will newer happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('error');
        });
    });

    it('should call graphql endpoint with 1 file', () => {
      GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ policy0: 'filePolicy' }));

      return upload_policy('apiUrlRoot', 'accessToken', 'bee_icon', 'iuurtw324jir+gfd43trf/==', ['file.jpg'])
        .then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(res[0]).toBe('filePolicy');

          expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
          const queryParts = GraphQLClient.prototype.request.mock.calls[0][0].split('\n');

          expect(queryParts).toBeInstanceOf(Array);
          expect(queryParts.length).toBe(11);
          expect(queryParts[0]).toBe('query uploadPolicy {');
          expect(queryParts[1]).toBe('  policy0: upload_policy(filePath: "file.jpg", intent: bee_icon, identifier: "iuurtw324jir+gfd43trf/==") {');
          expect(queryParts[2]).toBe('    credential');
          expect(queryParts[3]).toBe('    date');
          expect(queryParts[4]).toBe('    identifier');
          expect(queryParts[5]).toBe('    key');
          expect(queryParts[6]).toBe('    policy');
          expect(queryParts[7]).toBe('    signature');
          expect(queryParts[8]).toBe('    upload_url');
          expect(queryParts[9]).toBe('  }');
          expect(queryParts[10]).toBe('}');
        });
    });

  });

  it('should call graphql endpoint with 2 files', () => {
    GraphQLClient.prototype.request.mockReturnValue(Promise.resolve({ policy0: 'file1Policy', policy1: 'file2Policy' }));

    return upload_policy('apiUrlRoot', 'accessToken', 'outbox', 'iuurtw324jir+gfd43trf/==', ['file1.jpg', 'file2.png'])
      .then((res) => {
        expect(res).toBeInstanceOf(Array);
        expect(res[0]).toBe('file1Policy');
        expect(res[1]).toBe('file2Policy');

        expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
        const queryParts = GraphQLClient.prototype.request.mock.calls[0][0].split('\n');

        expect(queryParts).toBeInstanceOf(Array);
        expect(queryParts.length).toBe(20);
        expect(queryParts[0]).toBe('query uploadPolicy {');
        expect(queryParts[1]).toBe('  policy0: upload_policy(filePath: "file1.jpg", intent: outbox, identifier: "iuurtw324jir+gfd43trf/==") {');
        expect(queryParts[2]).toBe('    credential');
        expect(queryParts[3]).toBe('    date');
        expect(queryParts[4]).toBe('    identifier');
        expect(queryParts[5]).toBe('    key');
        expect(queryParts[6]).toBe('    policy');
        expect(queryParts[7]).toBe('    signature');
        expect(queryParts[8]).toBe('    upload_url');
        expect(queryParts[9]).toBe('  }');
        expect(queryParts[10]).toBe('  policy1: upload_policy(filePath: "file2.png", intent: outbox, identifier: "iuurtw324jir+gfd43trf/==") {');
        expect(queryParts[11]).toBe('    credential');
        expect(queryParts[12]).toBe('    date');
        expect(queryParts[13]).toBe('    identifier');
        expect(queryParts[14]).toBe('    key');
        expect(queryParts[15]).toBe('    policy');
        expect(queryParts[16]).toBe('    signature');
        expect(queryParts[17]).toBe('    upload_url');
        expect(queryParts[18]).toBe('  }');
        expect(queryParts[19]).toBe('}');
      });
  });

});
