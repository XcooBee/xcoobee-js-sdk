import ApiUtils from './ApiUtils';
import NoteTypes from './NoteTypes';

/**
 * Fetches a page of conversations with the given target cursor.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} targetCursor
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>}
 * @property {Note[]} data - A page of conversations (aka notes).
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
export function getConversation(apiUrlRoot, apiAccessToken, targetCursor, after = null, first = null) {
  const query = `
    query getConversation($targetCursor: String!, $after: String, $first: Int) {
      conversation(target_cursor: $targetCursor, after: $after, first: $first) {
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
      const { conversation } = response;

      return conversation;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

/**
 * Fetches a page of the user's conversations.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>}
 * @property {Note[]} data - A page of conversations (aka notes).
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
export function getConversations(apiUrlRoot, apiAccessToken, userCursor, after = null, first = null) {
  const query = `
    query getConversations($userCursor: String!, $after: String, $first: Int) {
      conversations(user_cursor: $userCursor, after: $after, first: $first) {
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

      return conversations;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

/**
 * Sends a message to a consent destination or a breach destination.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} message
 * @param {*} userCursor
 * @param {*} consentId
 * @param {*} [breachId]
 *
 * @returns {Promise<Note>}
 *
 * @throws {XcooBeeError}
 */
export function sendUserMessage(apiUrlRoot, apiAccessToken, message, userCursor, consentId, breachId) {
  const mutation = `
    mutation sendUserMessage($config: SendMessageConfig) {
      send_message(config: $config) {
        date_c
        date_e
        note_text
        target_cursor
        xcoobee_id
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
