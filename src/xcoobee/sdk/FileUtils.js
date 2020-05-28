const EndPointUtils = require('../api/EndPointUtils');
const FileApi = require('../api/FileApi');
const PolicyApi = require('../api/PolicyApi');
const XcooBeeError = require('../core/XcooBeeError');

/**
 * Prepare pairs of related policies to files
 *
 * @param {string[]} files
 * @param {Object[]} policies
 *
 * @returns {Object[]}
 */
function prepareFilePolicyPairs(files, policies) {
  const pairs = [];
  // Note: Not expecting the lengths between the two arrays to be different, but
  // it doesn't hurt to be robust.
  const maxLen = Math.max(files.length, policies.length);
  for (let i = 0; i < maxLen; ++i) {
    const file = files[i] || null;
    const policy = policies[i] || null;
    pairs.push({ file, policy });
  }
  return pairs;
}

/**
 * @async
 * @param {string} apiUrlRoot
 * @param {string} apiAccessToken
 * @param {string} userCursor
 * @param {string} endPointName
 * @param {string[]} files
 *
 * @returns {Promise<Object, XcooBeeError>}
 */
async function upload(apiUrlRoot, apiAccessToken, userCursor, endPointName, files) {
  const endPoint = await EndPointUtils.findEndPoint(apiUrlRoot, apiAccessToken, userCursor, endPointName, 'flex');

  if (!endPoint) {
    throw new XcooBeeError(`Unable to find an endpoint named "${endPointName}" or "flex".`);
  }

  const uploadPolicyIntent = endPointName;
  const endPointCursor = endPoint.cursor;
  const policies = await PolicyApi.upload_policy(
    apiUrlRoot, apiAccessToken, uploadPolicyIntent, endPointCursor, files
  );
  const policyFilePairs = prepareFilePolicyPairs(files, policies);
  // Note: We don't want to upload one file, wait for the promise to resolve,
  // and then repeat.  Here we are uploading all files back-to-back so that they
  // can be processed concurrently.
  const fileUploadResults = await Promise.all(policyFilePairs.map((pair) => {
    const { file, policy } = pair;

    return FileApi.upload_file(file, policy).catch((err) => err); // return error back to user
  }));

  const result = policyFilePairs.map((pair, idx) => {
    const { file } = pair;
    const fileUploadResult = fileUploadResults[idx];
    if (fileUploadResult instanceof Error) {
      return { success: false, error: fileUploadResult, file };
    }
    return { success: true, file: file.replace(/^.*[\\\/]/, ''), filePath: file };
  });

  return result;
}

module.exports = {
  prepareFilePolicyPairs,
  upload,
};
