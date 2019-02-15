const Fs = require('fs');
const FormData = require('form-data');
const XcooBeeError = require('../core/XcooBeeError');
const ApiUtils = require('./ApiUtils');

/**
 * Uploads the specified file to the system.
 *
 * @param {File|string} file The path to the file to be uploaded or a `File`
 *   instance.
 * @param {Object} policy - The policy returned from `PolicyApi.upload_policy`.  It
 *   is used for S3 authentication.
 * @param {string} policy.credential
 * @param {string} policy.date
 * @param {string} policy.identifier
 * @param {string} policy.key
 * @param {string} policy.policy
 * @param {string} policy.signature
 * @param {string} policy.upload_url
 *
 * @returns {Promise<IncomingMessage>} - The HTTP response.
 *
 * @throws {XcooBeeError}
 */
const upload_file = (file, policy) => {
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
  if (typeof File === 'function' && file instanceof File) {
    formData.append('file', file);
  } else {
    formData.append('file', Fs.createReadStream(file));
  }

  return new Promise((resolve) => {
    const callback = (err, res, statusCode) => {
      if (err) {
        throw ApiUtils.transformError(err);
      }
      if (statusCode >= 300) {
        throw new XcooBeeError(`Failed to upload file at: ${file} using policy: ${JSON.stringify(policy)}`);
      }

      resolve(res);
    };

    if (typeof formData.submit === 'function') {
      formData.submit(url, (err, res) => callback(err, res, res.statusCode));
    } else {
      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          callback(null, request.responseText, request.status);
        }
      };
      request.open('POST', url);
      request.send(formData);
    }
  });
};

module.exports = {
  upload_file,
};
