import ApiUtils from './ApiUtils';

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 *
 * @returns {Promise<OutboxEndpoint[]>}
 */
export function outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor) {
  const query = `
    query getOutboxEndpoints($userCursor: String!) {
      outbox_endpoints(user_cursor: $userCursor) {
        data {
          cursor
          date_c
          name
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    userCursor,
  })
    .then(response => {
      const { outbox_endpoints } = response;
      const { data } = outbox_endpoints;

      // TODO: Should we be requesting page_info for this query? Find out what to do
      // with the page_info.  If page_info.has_next_page is true, then do more
      // requests need to be made for more data?

      return data;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  outbox_endpoints,
};
