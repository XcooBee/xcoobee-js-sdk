import ApiUtils from './ApiUtils';

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<OutboxEndpoint[]>}
 */
export function outbox_endpoints(apiUrlRoot, apiAccessToken, userCursor, after = null, first = null) {
  // const query = `
  //   query getOutboxEndpoints($userCursor: String!, $after: String, $first: Int) {
  //     outbox_endpoints(user_cursor: $userCursor, after: $after, first: $first) {
  //       data {
  //         cursor
  //         date_c
  //         name
  //       }
  //       page_info {
  //         end_cursor
  //         has_next_page
  //       }
  //     }
  //   }
  // `;
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
    after,
    first,
    userCursor,
  })
    .then(response => {
      const { outbox_endpoints } = response;

      return outbox_endpoints;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  outbox_endpoints,
};
