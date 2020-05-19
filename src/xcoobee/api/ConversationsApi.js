const ApiUtils = require('./ApiUtils');
const NoteTypes = require('./NoteTypes');

/**
 * Fetches a page of conversations with the given target cursor.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} targetCursor
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>} - The result.
 * @property {Note[]} data - A page of conversations (aka notes).
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const getConversation = (apiUrlRoot, apiAccessToken, targetCursor, after = null, first = null) => {
  const query = `
    query getConversation($targetCursor: String!, $after: String, $first: Int) {
      conversation(target_cursor: $targetCursor, after: $after, first: $first) {
        data {
          reference_cursor
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
    .then((response) => {
      const { conversation } = response;

      return conversation;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches a page of the user's conversations.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>} - The result.
 * @property {Note[]} data - A page of conversations (aka notes).
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const getConversations = (apiUrlRoot, apiAccessToken, userCursor, after = null, first = null) => {
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
    .then((response) => {
      const { conversations } = response;

      return conversations;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * @private
 * @param {string} apiUrlRoot
 * @param {string} apiAccessToken
 * @param {string} referenceId
 * @param {string} type
 *
 * @returns {Promise<string>}
 */
const getTargetId = (apiUrlRoot, apiAccessToken, referenceId, type) => {
  const query = `
    query getNoteTarget($referenceId: String!, $type: NoteType!){
      note_target (reference_cursor: $referenceId, note_type: $type){
        cursor
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    referenceId,
    type,
  })
    .then((response) => {
      const { note_target } = response;

      return note_target.cursor;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Sends a message to a destination depending on reference.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} message
 * @param {Object} reference
 * @param {string} [reference.consentId]
 * @param {string} [reference.ticketId]
 * @param {string} [reference.requestRef]
 *
 * @returns {Promise<Note>}
 *
 * @throws {XcooBeeError}
 */
const sendUserMessage = async (apiUrlRoot, apiAccessToken, message, reference = {}) => {
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

  const {
    consentId,
    ticketId,
    requestRef,
    complaintRef,
  } = reference;

  let noteType;
  let referenceCursor;

  if (consentId) {
    noteType = NoteTypes.CONSENT;
    referenceCursor = consentId;
  } else if (ticketId) {
    noteType = NoteTypes.TICKET;
    referenceCursor = ticketId;
  } else if (requestRef) {
    noteType = NoteTypes.DATA_REQUEST;
    referenceCursor = requestRef;
  } else if (complaintRef) {
    noteType = NoteTypes.COMPLAINT;
    referenceCursor = complaintRef;
  } else {
    throw new TypeError('Only one reference should be provided');
  }

  const userCursor = await getTargetId(apiUrlRoot, apiAccessToken, referenceCursor, noteType);

  const config = {
    reference_cursor: referenceCursor,
    message,
    note_type: noteType,
    user_cursor: userCursor,
  };

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config,
  })
    .then((response) => {
      const { send_message } = response;

      return send_message;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  getConversation,
  getConversations,
  sendUserMessage,
};
