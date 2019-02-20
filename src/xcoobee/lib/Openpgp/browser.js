// console.log('Openpgp/browser.js');
const loadScript = require('@afuggini/loadscript');

const openpgpUrl = 'https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.4.9/openpgp.min.js';
const openpgpWebWorkerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.4.9/openpgp.worker.min.js';

let openpgp = null;

exports.fetchOpenpgp = async () => {
  // console.log('(browser) fetchOpenpgp');
  return new Promise((resolve, reject) => {
    if (openpgp) {
      resolve(openpgp);
    } else {
      // console.log('Calling loadScript...');
      // eslint-disable-next-line no-unused-vars
      loadScript(openpgpUrl).then((openpgpScriptDom_unused) => {
        // console.log('loadScript called');
        // eslint-disable-next-line no-undef
        if (window.openpgp) {
          // eslint-disable-next-line no-undef
          openpgp = window.openpgp;

          openpgp.initWorker({ path: openpgpWebWorkerUrl });

          resolve(openpgp);
        } else {
          const error = Error('Failed to load OpenPgp Checkout library.');
          reject(error);
        }
      });
    }
  });
};
