import openpgp from 'openpgp';

openpgp.initWorker({ path: 'openpgp.worker.js' }); // set the relative web worker path

export default openpgp;
