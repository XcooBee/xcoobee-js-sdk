const { fetchOpenpgp } = require('../lib/Openpgp');

/**
 * Decrypts cipher text.
 *
 * @param {string} cipherText - The armored, encrypted text.
 * @param {string} armoredPrivKey - The armored private key that corresponds with
 *   the public key used to encrypt the session key. May be encrypted if
 *   `passphrase` is given.
 * @param {string} [passphrase] - The passphrase used to encrypt the private key.
 *   Needed to decrypt the private key.
 */
const decryptWithEncryptedPrivateKey = async (cipherText, armoredPrivKey, passphrase) => {
  const openpgp = await fetchOpenpgp();
  const privKeyObj = (await openpgp.key.readArmored(armoredPrivKey)).keys[0];
  if (passphrase) {
    await privKeyObj.decrypt(passphrase);
  }

  const options = {
    message: await openpgp.message.readArmored(cipherText), // parse armored message
    privateKeys: [privKeyObj], // for decryption
  };

  const plainText = await openpgp.decrypt(options);
  return plainText.data;
};

module.exports = {
  decryptWithEncryptedPrivateKey,
};
