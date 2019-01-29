const sinon = require('sinon');
const jest = require('jest');

jest.mock('openpgp');

const openpgp = require('openpgp');


const { decryptWithEncryptedPrivateKey } = require('../../../../../src/xcoobee/core/EncryptionUtils');

describe('EncryptionUtils', () => {

  afterEach(() => sinon.restore());

  describe('decryptWithEncryptedPrivateKey', () => {

    it('should read passphrase and decrypt message', () => {
      openpgp.key.readArmored
        .mockReturnValue(Promise.resolve({
          keys: [{ decrypt: passphrase => expect(passphrase).toBe(12345) }],
        }));

      openpgp.message.readArmored.mockReturnValue(Promise.resolve('message'));

      openpgp.decrypt.mockReturnValue(Promise.resolve({ data: 'decryptedData' }));

      return decryptWithEncryptedPrivateKey('encryptedData', 'privateKey', 12345)
        .then(res => expect(res).toBe('decryptedData'));
    });

    it('should only decrypt message', () => {
      openpgp.key.readArmored.mockReturnValue(Promise.resolve({
        keys: [{ decrypt: () => expect(false).toBe(true) }], // this will never happen
      }));

      openpgp.message.readArmored.mockReturnValue(Promise.resolve('message'));

      openpgp.decrypt.mockReturnValue(Promise.resolve({ data: 'decryptedData' }));

      return decryptWithEncryptedPrivateKey('encryptedData', 'privateKey')
        .then(res => expect(res).toBe('decryptedData'));
    });

  });

});
