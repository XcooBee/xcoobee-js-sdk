const EndPointApi = require('../../xcoobee/api/EndPointApi');
const XcooBeeError = require('../core/XcooBeeError');

/**
 * @async
 * @param {string} apiUrlRoot
 * @param {string} apiAccessToken
 * @param {string} userCursor
 * @param {string} endPointName
 * @param {string} fallbackEndPointName
 *
 * @returns {Promise<EndPoint | XcooBeeError>}
 */
async function findEndPoint(apiUrlRoot, apiAccessToken, userCursor, endPointName, fallbackEndPointName) {
  const { data } = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);

  const endpoints = data.filter(endpoint => [endPointName, fallbackEndPointName].includes(endpoint.name));

  if (endpoints.length) {
    return endpoints[0];
  }

  throw new XcooBeeError(`Unable to find an endpoint named ${endPointName} or the fallback end point.`);
}

module.exports = {
  findEndPoint,
};
