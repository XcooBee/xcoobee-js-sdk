import ApiUtils from '../api/ApiUtils';

import { createClient } from './ApiUtils';

/**
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userId - The ID of the user.
 *
 * @returns {Promise<Bees[]>}
 */
export function outbox_endpoints(apiAccessToken, userId) {
  // TODO: Find out if we can rename getEndpoint to getOutboxEndpoints in the
  // following query.
  const query = `
    query getEndpoint($userId: String!) {
      outbox_endpoints(user_cursor: $userId) {
        data {
          content {
            filename
            size
          }
          cursor
          date_c
          name
          user_cursor
          type
        }
      }
    }
  `;
  return createClient(apiAccessToken).request(query, {
    userId,
  })
    .then((response) => {
      const { outbox_endpoints } = response;
      const { data } = outbox_endpoints;

      // TODO: Should we be requesting page_info for this query? Find out what to do
      // with the page_info.  If page_info.has_next_page is true, then do more
      // requests need to be made for more data?

      return Promise.resolve(data);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  outbox_endpoints,
};
