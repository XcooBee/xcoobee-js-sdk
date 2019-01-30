const Path = require('path');

const ApiUtils = require('./ApiUtils');
const UploadPolicyIntents = require('./UploadPolicyIntents');

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {'bee_icon'|'invite_list'|'outbox'|'profile_image'} intent
 * @param {string} endPointCursor
 * @param {Array<string|File>} files
 *
 * @returns {Promise<Policy[]>} A list of policies, one for each file uploaded.
 *
 * @throws {XcooBeeError}
 */
const upload_policy = (apiUrlRoot, apiAccessToken, intent, endPointCursor, files) => {
  if (!UploadPolicyIntents.values.includes(intent)) {
    return Promise.reject(new TypeError(`'intent' must be one of ${UploadPolicyIntents.values.join(', ')}.`));
  }
  if (!ApiUtils.appearsToBeACursor(endPointCursor)) {
    return Promise.reject(new TypeError('`endPointCursor` is required.'));
  }
  if (!Array.isArray(files)) {
    return Promise.reject(new TypeError('`files` must be an array.'));
  }

  let query = ['query uploadPolicy {'];
  files.forEach((file, idx) => {
    const baseName = Path.basename(file);

    /* eslint-disable-next-line max-len */
    query.push(`  policy${idx}: upload_policy(filePath: "${baseName}", intent: ${intent}, identifier: "${endPointCursor}") {`);
    query.push('    credential');
    query.push('    date');
    query.push('    identifier');
    query.push('    key');
    query.push('    policy');
    query.push('    signature');
    query.push('    upload_url');
    query.push('  }');
  });
  query.push('}');
  query = query.join('\n');

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query)
    .then((response) => {
      const policies = [];

      for (let i = 0, iLen = files.length; i < iLen; ++i) {
        let policy = null;
        const key = `policy${i}`;

        if (response[key]) {
          policy = response[key];
        }
        policies.push(policy);
      }

      return policies;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  upload_policy,
};
