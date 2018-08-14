import ApiUtils from './ApiUtils';
import NoteTypes from './NoteTypes';

/**
 * TODO: Complete documentation.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} targetCursor
 * @param {*} first
 * @param {*} after
 *
 * @returns {Promise<Note>}
 */
export function getConversation(apiUrlRoot, apiAccessToken, targetCursor, first = null, after = null) {
  // TODO: Decide what data should be returned.
  const query = `
    query getConversation($targetCursor: String!, $first: Int, $after: String) {
      conversation(target_cursor: $targetCursor, first: $first, after: $after) {
        data {
          breach_cursor
          consent_cursor
          date_c
          date_e
          display_city
          display_country
          display_name
          display_province
          is_outbound
          note_text
          note_type
          photo_url
          target_cursor
          xcoobee_id
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
    targetCursor,
  })
    .then(response => {
      const { conversations } = response;
      const { data } = conversations;

      // TODO: Find out what to do with the page_info.  If page_info.has_next_page is
      // true, then do more requests need to be made for more data?

      return data;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

/**
 * TODO: Complete documentation.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} userCursor
 * @param {*} first
 * @param {*} after
 *
 * @returns {Promise<Note>}
 */
export function getConversations(apiUrlRoot, apiAccessToken, userCursor, first = null, after = null) {
  const query = `
    query getConversations($userCursor: String!, $first: Int, $after: String) {
      conversations(user_cursor: $userCursor, first: $first, after: $after) {
        data {
          date_c
          display_name
          note_type
          target_cursor
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
      const { conversations } = response;
      const { data } = conversations;

      // TODO: Find out what to do with the page_info.  If page_info.has_next_page is
      // true, then do more requests need to be made for more data?

      return data;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

/**
 * TODO: Complete documentation.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} message
 * @param {*} userCursor
 * @param {*} consentId
 * @param {*} [breachId]
 *
 * @returns {Promise<Note>}
 */
export function sendUserMessage(apiUrlRoot, apiAccessToken, message, userCursor, consentId, breachId) {
  const mutation = `
    mutation sendUserMessage($config: SendMessageConfig) {
      send_message(config: $config) {
        note_text
      }
    }
  `;
  const noteType = breachId ? NoteTypes.BREACH : NoteTypes.CONSENT;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: {
      breach_cursor: breachId,
      consent_cursor: consentId,
      message,
      note_type: noteType,
      user_cursor: userCursor,
    },
  })
    .then(response => {
      const { send_message } = response;

      return send_message;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  getConversation,
  getConversations,
  sendUserMessage,
};
