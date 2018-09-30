import { GraphQLClient } from 'graphql-request';

import XcooBeeError from "../core/XcooBeeError";

const CURSOR__RE = /^[\w/=+]+$/;

const EMAIL_ADDRESS__RE = /^[-+\w]+(\.[-+\w]+)*@([-a-z0-9]+\.)+[a-z]{2,6}$/i;

/**
 * @private
 * @param {string} campaignId
 *
 * @returns {boolean}
 */
function appearsToBeACampaignId(campaignId) {
  return typeof campaignId === 'string' && campaignId.length > 0;
}

/**
 * Asserts that the given string appears to be a cursor.
 *
 * @param {string} value
 *
 * @returns {boolean} `true` if the given string appears to be a cursor. Otherwise,
 *   `false`.
 */
export function appearsToBeACursor(value) {
  return CURSOR__RE.test(value);
}

/**
 * Checks whether the given string appears to be an email address.
 *
 * @param {string} value - The value to check.
 *
 * @returns {boolean} `true` if the given string appears to be an email address.
 *   Otherwise, `false`.
 */
export function appearsToBeAnEmailAddress(value) {
  return EMAIL_ADDRESS__RE.test(value);
}

/**
 * Asserts that the given campaign ID string appears to be a campaign ID.
 *
 * @param {string} campaignId
 *
 * @throws {XcooBeeError}
 */
export function assertAppearsToBeACampaignId(campaignId) {
  if (!appearsToBeACampaignId(campaignId)) {
    throw new XcooBeeError('Campaign ID is required');
  }
}

/**
 * Creates a new GraphQL client, ready to make a request.
 *
 * ```js
 * ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, variables)
 *   .then(...);
 * ```
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
    let { errors } = inputError.response;
    if (!Array.isArray(errors)) {
      errors = [errors];
    }
    let msg = errors.map(errorToMessage).join('\n');
    return new XcooBeeError(msg);
  }
  return new XcooBeeError(inputError);
}

/**
 * @private
 * @param {Object} error
 * @param {string} [error.message]
 * @param {Object[]} [error.locations]
 *
 * @returns {string}
 */
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

/**
 * @private
 * @param {Object} loc
 *
 * @returns {string}
 */
function locationToMessage(loc) {
  return `at line: ${loc.line}, column: ${loc.column}`;
}

export default {
  appearsToBeACursor,
  appearsToBeAnEmailAddress,
  assertAppearsToBeACampaignId,
  createClient,
  transformError,
};
