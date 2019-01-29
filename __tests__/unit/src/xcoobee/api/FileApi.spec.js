const sinon = require('sinon');
const FormData = require('form-data');

const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

const { upload_file } = require('../../../../../src/xcoobee/api/FileApi');

describe('FileApi', () => {

  afterEach(() => sinon.restore());

  describe('upload_file', () => {

    const policy = {
      url: 'test',
      key: 'test',
      credential: 'test',
      date: 'test',
      identifier: 'test',
      policy: 'test',
      signature: 'test',
    };

    it('should format and return error', () => {
      sinon.stub(FormData.prototype, 'submit').yields('error');

      return upload_file('image.jpg', policy)
        .then(() => expect(false).toBe(true)) // this will newer happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('error');
        });
    });

    it('should return error if result status code more than 300', () => {
      sinon.stub(FormData.prototype, 'submit').yields(null, { statusCode: 400 });

      return upload_file('image.jpg', policy)
        .then(() => expect(false).toBe(true)) // this will newer happen
        .catch((err) => {
          expect(err).toBeInstanceOf(XcooBeeError);
          expect(err.message).toBe('Failed to upload file at: image.jpg using policy: {"url":"test","key":"test","credential":"test","date":"test","identifier":"test","policy":"test","signature":"test"}');
        });
    });

    it('should return result if everything is ok', () => {
      sinon.stub(FormData.prototype, 'submit').yields(null, { statusCode: 200 });

      return upload_file('image.jpg', policy)
        .then(res => expect(res.statusCode).toBe(200));
    });

  });

});
