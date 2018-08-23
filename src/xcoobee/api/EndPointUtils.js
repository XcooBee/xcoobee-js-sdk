import EndPointApi from '../../xcoobee/api/EndPointApi';

async function findEndPoint(apiUrlRoot, apiAccessToken, userCursor, endPointName, fallbackEndPointName) {
  const endPoints = await EndPointApi.outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor);

  // Find the endpoint with the name matching the specified name.
  let candidateEndPoints = endPoints.filter(endPoint => endPoint.name === endPointName);

  // If not found, then use fallback endpoint if available.
  if (candidateEndPoints.length === 0 && fallbackEndPointName) {
    candidateEndPoints = endPoints.filter(endPoint => endPoint.name === fallbackEndPointName);
  }

  if (candidateEndPoints.length !== 1) {
    throw new XcooBeeError(`Unable to find an endpoint named ${endPointName} or the fallback end point.`);
  }

  const endPoint = candidateEndPoints[0];
  return endPoint;
}

export default {
  findEndPoint,
};
