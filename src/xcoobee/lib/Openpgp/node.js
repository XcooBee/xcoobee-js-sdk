// console.log('Openpgp/node.js');
const openpgp = require('openpgp');

exports.fetchOpenpgp = () => {
  // console.log('(node) fetchOpenpgp');
  return Promise.resolve(openpgp);
};
