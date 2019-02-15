const XcooBeeError = require('../../../../../src/xcoobee/core/XcooBeeError');

describe('XcooBeeError', () => {

  describe('constructor', () => {

    describe('called with no arguments', () => {

      it('should construct the expected instance', () => {
        const error = new XcooBeeError();

        expect(error).toBeInstanceOf(XcooBeeError);
        expect(error.message).toBe('');
        expect(error.name).toBe('XcooBeeError');
      });

    });

    describe('called with one argument', () => {

      it('should construct the expected instance', () => {
        const error = new XcooBeeError('Something bad happened.');

        expect(error).toBeInstanceOf(XcooBeeError);
        expect(error.message).toBe('Something bad happened.');
        expect(error.name).toBe('XcooBeeError');
      });

    });

  });

});
