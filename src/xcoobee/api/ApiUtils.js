import { GraphQLClient } from 'graphql-request';

import XcooBeeError from "../core/XcooBeeError";


function appearsToBeACampaignId(campaignId) {
  return typeof campaignId === 'string' && campaignId.length > 0;
}

export function assertAppearsToBeACampaignId(campaignId) {
  if (!appearsToBeACampaignId(campaignId)) {
    throw new XcooBeeError('Campaign ID is required');
  }
}

/**
 * Creates a new GraphQL client, ready to make a request.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 *
 * @returns {GraphQLClient}
 */
export function createClient(apiUrlRoot, apiAccessToken) {
  const graphqlApiUrl = apiUrlRoot + '/graphql';
  return new GraphQLClient(graphqlApiUrl, {
    headers: {
      // TODO: Suggest that 'Bearer ' should be included in Authorization header.
      Authorization: `${apiAccessToken}`,
    }
  });
}

/**
 * Transforms the input error into the appropriate `XcooBeeError` instance.
 *
 * @param {Error} inputError The error to be transformed.
 *
 * @returns {XcooBeeError}
 */
export function transformError(inputError) {
  // TODO: Come up with a standard way to handle errors.
  if (inputError instanceof XcooBeeError) {
    return inputError;
  }
  let status = 0;
  if (inputError.response && typeof inputError.response.status === 'number') {
    status = inputError.response.status;
  }
  if (status === 401) {
    return new XcooBeeError('401 Unauthorized.  Please make sure your API access token is fresh.');
  }
  if (inputError.response && inputError.response.errors) {
    let errors = inputError.response.errors;
    if (!Array.isArray(errors)) {
      errors = [errors];
    }
    let msg = errors.map(errorToMessage).join('\n');
    return new XcooBeeError(msg);
  }
  return new XcooBeeError(inputError);
}

function errorToMessage(error) {
  let msg = [];
  if (error.message) {
    msg.push(error.message);
  }
  if (error.locations) {
    msg.push(error.locations.map(locationToMessage).join(', '));
  }
  if (msg.length === 0) {
    msg.push(JSON.stringify(error));
  }
  msg = msg.join(' ');
  return msg;
}

function locationToMessage(loc) {
  return `at line: ${loc.line}, column: ${loc.column}`;
}

export default {
  assertAppearsToBeACampaignId,
  createClient,
  transformError,
};
