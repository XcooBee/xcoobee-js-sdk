import Path from 'path';

import ApiUtils, { appearsToBeACursor } from './ApiUtils';
import UploadPolicyIntents from './UploadPolicyIntents';

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
export function upload_policy(apiUrlRoot, apiAccessToken, intent, endPointCursor, files) {
  if (!UploadPolicyIntents.values.includes(intent)) {
    throw TypeError('`intent`' + ` must be one of ${UploadPolicyIntents.values.join(', ')}.`);
  }
  if (!appearsToBeACursor(endPointCursor)) {
    throw TypeError('`endPointCursor` is required.');
  }
  if (!Array.isArray(files)) {
    throw TypeError('`files` must be an array.');
  }

  let query = ['query uploadPolicy {'];
  files.forEach((file, idx) => {
    let baseName;
    if (file instanceof File) {
      baseName = file.name;
    }
    else {
      baseName = Path.basename(file);
    }

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
  query = query.join('\n')

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query)
    .then(response => {
      const policies = [];

      for (let i = 0, iLen = files.length; i < iLen; ++i) {
        let policy = null;
        const key = `policy${i}`;

        if (key in response) {
          policy = response[key];
        }
        policies.push(policy);
      }

      return policies;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  upload_policy,
};
