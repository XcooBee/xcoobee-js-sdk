import ApiUtils from './ApiUtils';

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 *
 * @returns {Promise<Event[]>}
 */
export function getEvents(apiUrlRoot, apiAccessToken, userCursor) {
  const query = `
    query getEvents($userId: String!) {
      events(user_cursor: $userId) {
        data {
          event_id
          reference_cursor
          reference_type
          owner_cursor
          event_type
          payload
          hmac
          date_c
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    userId: userCursor,
  })
    .then(response => {
      const { events } = response;
      const { data } = events;

      // TODO: Should we be requesting page_info for this query? Find out what to do
      // with the page_info.  If page_info.has_next_page is true, then do more
      // requests need to be made for more data?

      return Promise.resolve(data);
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  getEvents,
};
