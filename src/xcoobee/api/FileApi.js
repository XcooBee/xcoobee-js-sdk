import Fs from 'fs';

import FormData from 'form-data';

import XcooBeeError from '../core/XcooBeeError';

import ApiUtils from './ApiUtils';

/**
 * Uploads the specified file to the system.
 *
 * @param {File|string} file The path to the file to be uploaded or a `File`
 *   instance.
 * @param {Object} policy - The policy returned from `PolicyApi.upload_policy`.  It
 *   is used for S3 authentication.
 * @param {String} policy.credential
 * @param {String} policy.date
 * @param {String} policy.identifier
 * @param {String} policy.key
 * @param {String} policy.policy
 * @param {String} policy.signature
 * @param {String} policy.upload_url
 *
 * @returns {Promise<IncomingMessage>}
 *
 * @throws {XcooBeeError}
 */
export function upload_file(file, policy) {
  const url = policy.upload_url;
  // See https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-authentication-HTTPPOST.html
  const formData = new FormData();
  formData.append('key', policy.key);
  formData.append('acl', 'private');
  formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
  formData.append('X-Amz-Credential', policy.credential);
  formData.append('X-Amz-Date', policy.date);
  formData.append('X-Amz-meta-identifier', policy.identifier);
  formData.append('Policy', policy.policy);
  formData.append('X-Amz-Signature', policy.signature);
  if (file instanceof File) {
    formData.append('file', file);
  }
  else {
    formData.append('file', Fs.createReadStream(file));
  }

  return new Promise((resolve, reject_unused) => {
    formData.submit(url, (err, res /*: IncomingMessage */) => {
      if (err) {
        throw ApiUtils.transformError(err);
      }
      const { statusCode } = res;
      if (statusCode >= 300) {
        let filePath;
        if (file instanceof File) {
          filePath = file.name;
        }
        else {
          filePath = file;
        }
        throw new XcooBeeError(`Failed to upload file at: ${filePath} using policy: ${JSON.stringify(policy)}`);
      }

      resolve(res);
    });
  });
}

export default {
  upload_file,
};
