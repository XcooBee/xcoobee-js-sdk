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
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 * @param {string} messageId - The ID of the inbox item.
 *
 * @returns {Promise<Object>} - The result.
 * @property {InboxItemDetails} inbox_item - The inbox item details.
 * @property {string} inbox_item.download_link - The inbox item download link.
 * @property {InboxItem} inbox_item.info - The inbox item info.
 *
 * @throws {XcooBeeError}
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

      const result = { inbox_item };
      return result;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

/**
 * Fetch a page of items from the inbox.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} [startId] The starting message ID.
 *
 * @returns {Promise<Object>} - A page of the inbox.
 * @property {InboxItem[]} data - Inbox items for this page.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
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
      const result = {
        data,
        page_info,
      };
      return result;
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
