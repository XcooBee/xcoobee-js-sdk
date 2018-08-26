import ApiUtils from './ApiUtils';

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 *
 * @returns {Promise<Object>}
 * @property {Event[]} data - A page of events.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
export function getEvents(apiUrlRoot, apiAccessToken, userCursor) {
  const query = `
    query getEvents($userId: String!) {
      events(user_cursor: $userId) {
        data {
          date_c
          event_id
          event_type
          hmac
          owner_cursor
          payload
          reference_cursor
          reference_type
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    userId: userCursor,
  })
    .then(response => {
      const { events } = response;

      return events;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  getEvents,
};
