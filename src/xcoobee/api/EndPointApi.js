import ApiUtils from './ApiUtils';

/**
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 *
 * @returns {Promise<OutboxEndpoint[]>}
 */
export function outbox_endpoints(apiAccessToken, userCursor) {
  const query = `
    query getOutboxEndpoints($userId: String!) {
      outbox_endpoints(user_cursor: $userId) {
        data {
          cursor
          date_c
          name
        }
      }
    }
  `;
  return ApiUtils.createClient(apiAccessToken).request(query, {
    userId: userCursor,
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
