const ApiUtils = require('../../../../../src/xcoobee/api/ApiUtils');

describe('ApiUtils', () => {

  describe('appearsToBeAnEmailAddress', () => {

    describe('called with an email address', () => {

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

  });// eo describe('appearsToBeAnEmailAddress')

});// eo describe('ApiUtils')
