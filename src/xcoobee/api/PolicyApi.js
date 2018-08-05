import Path from 'path';

import ApiUtils from './ApiUtils';

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {'bee_icon'|'invite_list'|'outbox'|'profile_image'} intent
 * @param {string} endPointCursor
 * @param {string[]} files
 *
 * @returns {Promise<Policy[]>}
 */
export function upload_policy(apiUrlRoot, apiAccessToken, intent, endPointCursor, files) {
  // TODO: Validate arguments;
  let query = ['query uploadPolicy {'];
  files.forEach((file, idx) => {
    let baseName;
    if (file instanceof File) {
      baseName = file.name;
    }
    else {
      baseName = Path.basename(file);
    }

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
    .then((response) => {
      const policies = [];

      for (let i = 0, iLen = files.length; i < iLen; ++i) {
        let policy = null;
        const key = `policy${i}`;

        if (key in response) {
          policy = response[key];
        }
        policies.push(policy);
      }

      return Promise.resolve(policies);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  upload_policy,
};
