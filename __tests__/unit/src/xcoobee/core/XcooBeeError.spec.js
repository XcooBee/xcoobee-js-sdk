import XcooBeeError from '../../../../../src/xcoobee/core/XcooBeeError';

describe('XcooBeeError', function () {

  describe('constructor', function () {

    describe('called with no arguments', function () {

      it('should construct the expected instance', function () {
        let error = new XcooBeeError();

        expect(error).toBeInstanceOf(XcooBeeError);
        expect(error.message).toBe('');
        expect(error.name).toBe('XcooBeeError');
      });

    });

    describe('called with one argument', function () {

      it('should construct the expected instance', function () {
        let error = new XcooBeeError('Something bad happened.');

        expect(error).toBeInstanceOf(XcooBeeError);
        expect(error.message).toBe('Something bad happened.');
        expect(error.name).toBe('XcooBeeError');
      });

    });

  });

});
