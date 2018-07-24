import FormData from 'form-data';
import Fs from 'fs';

import XcooBeeError from '../core/XcooBeeError';

import ApiUtils from './ApiUtils';

/**
 * Uploads the specified file to the system.
 *
 * @param {*} filePath The path to the file to be uploaded.
 * @param {Object} policy - The policy used for S3 authentication.
 * @param {String} policy.credential
 * @param {String} policy.date
 * @param {String} policy.identifier
 * @param {String} policy.key
 * @param {String} policy.policy
 * @param {String} policy.signature
 * @param {String} policy.upload_url
 *
 * @throws XcooBeeError
 */
export function upload_file(filePath, policy) {
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
  formData.append('file', Fs.createReadStream(filePath));

  return new Promise((resolve, reject) => {
    formData.submit(url, (err, res /*: IncomingMessage */) => {
      if (err) {
        throw ApiUtils.transformError(err);
      }
      const statusCode = res.statusCode;
      if (statusCode >= 300) {
        throw new XcooBeeError(`Failed to upload file at: ${filePath} using policy: ${JSON.stringify(policy)}`);
      }

      resolve(res);
    });
  });
}

export default {
  upload_file,
};
