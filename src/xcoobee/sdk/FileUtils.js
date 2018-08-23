import EndPointUtils from '../../xcoobee/api/EndPointUtils';
import FileApi from '../../xcoobee/api/FileApi';
import PolicyApi from '../../xcoobee/api/PolicyApi';

function zipTogether(files, policies) {
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
  const policyFilePairs = zipTogether(files, policies);
  // Note: We don't want to upload one file, wait for the promise to resolve,
  // and then repeat.  Here we are uploading all files back-to-back so that they
  // can be processed concurrently.
  const fileUploadPromises = policyFilePairs.map(pair => {
    const { file, policy } = pair;

    return FileApi.upload_file(file, policy);
  });

  // Then here we resolve each promise.
  const fileUploadResults = await new Promise(resolve => {
    const fileUploadResults = fileUploadPromises.map(async (promise) => {
      let fileUploadResult;
      try {
        fileUploadResult = await promise;
      }
      catch (err) {
        fileUploadResult = err;
      }
      return fileUploadResult
    });
    resolve(fileUploadResults);
  });

  const results = policyFilePairs.map((pair, idx) => {
    const { file } = pair;
    const fileUploadResult = fileUploadResults[idx];
    if (fileUploadResult instanceof Error) {
      return { success: false, error: fileUploadResult, file };
    }
    return { success: true, file };
  });

  return results;
}

export default {
  upload,
};
