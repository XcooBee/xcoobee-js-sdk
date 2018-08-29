import ApiUtils from './ApiUtils';

/**
 * Deletes an item from the inbox with the specified message ID.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 * @param {string} messageId - The ID of the inbox item.
 *
 * @returns {Promise<Object>} - The result.
 * @property {string} trans_id - The transaction ID.
 *
 * @throws {XcooBeeError}
 */
export function deleteInboxItem(apiUrlRoot, apiAccessToken, userCursor, messageId) {
  const query = `
    mutation deleteInboxItem($userCursor: String!, $messageId: String!) {
      remove_inbox_item(user_cursor: $userCursor, filename: $messageId) {
        trans_id
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    userCursor,
    messageId
  })
    .then(response => {
      const { remove_inbox_item } = response;
      // Note: remove_inbox_item is not defined if nothing is deleted.
      const { trans_id } = remove_inbox_item || { trans_id: null };

      const result = { trans_id };
      return result;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

/**
 * Fetches an item from the inbox with the specified message ID.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 * @param {string} messageId - The ID of the inbox item.
 *
 * @returns {Promise<Object>} - The results.
 * @returns {InboxItemDetails} return.inbox_item - The inbox item details.
 * @returns {string} return.inbox_item.download_link - The inbox item download link.
 * @returns {InboxItem} return.inbox_item.info - The inbox item info.
 */
export function getInboxItem(apiUrlRoot, apiAccessToken, userCursor, messageId) {
  const query = `
    query getInboxItem($userCursor: String!, $messageId: String!) {
      inbox_item(user_cursor: $userCursor, filename: $messageId) {
        download_link
        info {
          date
          downloaded
          filename
          file_size
          file_tags
          file_type
          from
          from_xcoobee_id
          original_name
          sender {
            from
            from_xcoobee_id
            name
            photo_url
            validation_score
          }
          trans_id
          trans_name
          user_ref
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    messageId,
    userCursor,
  })
    .then(response => {
      const { inbox_item } = response;

      const results = { inbox_item };
      return results;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

/**
 * Fetch a page of items from the inbox.
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} [startId] The starting message ID.
 *
 * @returns {Promise<Object>} - The results.
 * @returns {Object} return.inbox - A page of the inbox.
 * @returns {InboxItem[]} return.inbox.data - Inbox items for this page.
 * @returns {PageInfo} return.inbox.page_info - The page info.
 */
export function listInbox(apiUrlRoot, apiAccessToken, startId) {
  const query = `
    query listInbox($startId: String) {
      inbox(after: $startId) {
        data {
          date
          downloaded
          file_size
          filename
          original_name
          sender {
            from
            from_xcoobee_id
            name
            validation_score
          }
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    startId,
  })
    .then(response => {
      const { inbox } = response;
      let { data, page_info } = inbox;

      data = data.map(item => {
        return {
          messageId: item.filename,
          fileName: item.original_name,
          fileSize: item.file_size,
          sender: {
            ...item.sender
          },
          receiptDate: item.date,
          downloadDate: item.downloaded,
          expirationDate: item.date,
        };
      });
      const results = {
        inbox: {
          data,
          page_info,
        },
      };
      return results;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  deleteInboxItem,
  getInboxItem,
  listInbox,
};
