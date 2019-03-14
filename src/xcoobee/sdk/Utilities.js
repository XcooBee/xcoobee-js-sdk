const { upload_file } = require('../api/FileApi');
const { prepareFilePolicyPairs } = require('./FileUtils');

module.exports = {
  uploadFiles: (files, policies) => {
    const policyFilePairs = prepareFilePolicyPairs(files, policies);

    return Promise.all(policyFilePairs.map((pair) => {
      const { file, policy } = pair;

      return upload_file(file, policy);
    })).then(() => true);
  },
};
