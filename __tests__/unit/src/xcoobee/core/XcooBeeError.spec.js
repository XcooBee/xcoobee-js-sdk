import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

describe('XcooBeeError', function () {

  describe('constructor', function () {

    describe('called with whatever', function () {

      it('should construct the expected instance', function () {
        let error = new XcooBeeError();

        expect(error).toBeInstanceOf(XcooBeeError);
        expect(error.message).toBe('');
        expect(error.name).toBe('XcooBeeError');
      });

    });

  });

});
