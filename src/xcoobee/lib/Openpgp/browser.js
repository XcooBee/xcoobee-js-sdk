const fetch = require('cross-fetch');

const openpgpWebWorkerUrl = 'https://app.xcoobee.net/scripts/sdk/openpgp.worker.min.js';

let openpgp = null;

exports.fetchOpenpgp = async () => {
  // console.log('(browser) fetchOpenpgp');
  return new Promise((resolve, reject) => {
    if (openpgp) {
      resolve(openpgp);
    } else {
      // console.log('Calling loadScript...');
      // eslint-disable-next-line no-unused-vars
      fetch(openpgpWebWorkerUrl)
        .then((response) => response.text())
        .then((worker) => {
          // console.log('loadScript called');
          // eslint-disable-next-line no-undef
          if (window.openpgp) {
            // eslint-disable-next-line no-undef
            openpgp = window.openpgp;

            openpgp.initWorker({ path: URL.createObjectURL(new Blob([worker], { type: 'text/javascript' })) });

            resolve(openpgp);
          } else {
            const error = Error('Failed to load OpenPgp Checkout library.');
            reject(error);
          }
        });
    }
  });
};
