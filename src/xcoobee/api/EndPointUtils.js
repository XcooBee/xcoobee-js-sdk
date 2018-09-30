import EndPointApi from '../../xcoobee/api/EndPointApi';

/**
 * @async
 * @param {string} apiUrlRoot
 * @param {string} apiAccessToken
 * @param {string} userCursor
 * @param {string} endPointName
 * @param {string} fallbackEndPointName
 *
 * @returns {Promise<EndPoint, XcooBeeError>}
 */
async function findEndPoint(apiUrlRoot, apiAccessToken, userCursor, endPointName, fallbackEndPointName) {
  let endPointNames = [endPointName];

  if (fallbackEndPointName) {
    endPointNames.push(fallbackEndPointName);
  }

  for (let i = 0, iLen = endPointNames.length; i < iLen; ++i) {
    let after = null;
    let fetchNextPage;
    const endPointName = endPointNames[i];
    do {
      const result = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor, after);
      const { data, page_info } = result;
      const endPoints = data;

      // Find the endpoint with the name matching the specified name.
      let candidateEndPoints = endPoints.filter(endPoint => endPoint.name === endPointName);

      if (candidateEndPoints.length === 1) {
        return candidateEndPoints[0];
      }

      // Note: It should be the case that `page_info` is always `null`. However, for
      // robustness, we'll iterate over any pages that may be returned.
      const { end_cursor, has_next_page } = (page_info || {});

      fetchNextPage = has_next_page && end_cursor;
      after = end_cursor;
    } while (fetchNextPage);
  }
  throw new XcooBeeError(`Unable to find an endpoint named ${endPointName} or the fallback end point.`);
}

export default {
  findEndPoint,
};
