import ApiUtils, { appearsToBeAnEmailAddress } from '../../../../../src/xcoobee/api/ApiUtils';

describe('ApiUtils', function () {

  describe('appearsToBeAnEmailAddress', function () {

    describe('called with an email address', function () {

      it('should return true', function () {
        expect(appearsToBeAnEmailAddress('a@b.com')).toBe(true);
        expect(appearsToBeAnEmailAddress('a@a.b.com')).toBe(true);
        expect(ApiUtils.appearsToBeAnEmailAddress('a@a.b.com')).toBe(true);
        expect(appearsToBeAnEmailAddress('a.b@c.de')).toBe(true);
        expect(appearsToBeAnEmailAddress('a.b@c.d.ef')).toBe(true);
        expect(appearsToBeAnEmailAddress('+.+@a.com')).toBe(true);
        expect(appearsToBeAnEmailAddress('-.+@a.com')).toBe(true);
        expect(appearsToBeAnEmailAddress('a@b-c.de')).toBe(true);
      });

    });

  });// eo describe('appearsToBeAnEmailAddress')

});// eo describe('ApiUtils')
