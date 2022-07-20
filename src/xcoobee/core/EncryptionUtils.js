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
  try {
    const openpgp = await fetchOpenpgp();
    let privKeyObj = (await openpgp.readKey({ armoredKey: armoredPrivKey }));
    if (passphrase) {
      privKeyObj = await openpgp.decryptKey({
        privateKey: privKeyObj,
        passphrase,
      });
    }

    const options = {
      message: await openpgp.readMessage({ armoredMessage: cipherText }), // parse armored message
      decryptionKeys: [privKeyObj], // for decryption
    };

    const plainText = await openpgp.decrypt(options);
    return JSON.parse(plainText.data);
  } catch (e) {
    // payload can't be decrypted, return encrypted
    return cipherText;
  }
};

/**
 * Initializes openpgp lib.
 * Needed to avoid multiple workers load on multiple events decryption
 *
 * @returns {Promise}
 */
const initializeOpenpgp = () => fetchOpenpgp();

module.exports = {
  decryptWithEncryptedPrivateKey,
  initializeOpenpgp,
};
