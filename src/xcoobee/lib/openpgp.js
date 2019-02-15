const openpgp = require('openpgp');

openpgp.initWorker({ path: 'openpgp.worker.js' }); // set the relative web worker path

module.exports = openpgp;
