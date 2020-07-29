jest.mock('../../../../../src/xcoobee/api/FileApi');

const FileApi = require('../../../../../src/xcoobee/api/FileApi');

const { uploadFiles } = require('../../../../../src/xcoobee/sdk/Utilities');

describe('Utilities', () => {

  describe('uploadFiles', () => {

    it('should successfully upload file', () => {
      FileApi.upload_file.mockReturnValue(Promise.resolve());

      return uploadFiles(['test.png', 'test2.jpg'], ['policy1', 'policy2'])
        .then(() => {
          expect(FileApi.upload_file).toHaveBeenCalledTimes(2);
          expect(FileApi.upload_file).toHaveBeenNthCalledWith(1, 'test.png', 'policy1');
          expect(FileApi.upload_file).toHaveBeenNthCalledWith(2, 'test2.jpg', 'policy2');

          FileApi.upload_file.mockReset();
        });
    });

  });

});
