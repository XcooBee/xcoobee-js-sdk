const { decryptWithEncryptedPrivateKey } = require('../core/EncryptionUtils');
const { toEventType } = require('./EventSubscriptionsApi');
const ApiUtils = require('./ApiUtils');

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} userCursor - The user's cursor.
 * @param {string} [privateKey] - The armored, encrypted private key.
 * @param {string} [passphrase] - The passphrase to decrypt the encrypted private key.
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>} - The result.
 * @property {Event[]} data - A page of events.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const getEvents = (apiUrlRoot, apiAccessToken, userCursor, privateKey, passphrase, after = null, first = null) => {
  const query = `
    query getEvents($userCursor: String!, $after: String, $first: Int) {
      events(user_cursor: $userCursor, after: $after, first: $first) {
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
    after,
    first,
    userCursor,
  })
    .then(async (response) => {
      const { events } = response;

      // If a private key and its passphrase are supplied, then decrypt payload for SDK
      // user.
      if (privateKey && passphrase) {
        events.data = await Promise.all(events.data.map(async (event) => {
          const payloadJson = await decryptWithEncryptedPrivateKey(
            event.payload,
            privateKey,
            passphrase
          );
          const payload = JSON.parse(payloadJson);
          return {
            ...event,
            payload,
          };
        }));
      }

      return events;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} [campaignId] - Campaign id.
 * @param {string} [type] - Event type to trigger.
 *
 * @returns {Promise<Object>} - The result.
 * @property {Event[]} data - A page of events.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const triggerEvent = (apiUrlRoot, apiAccessToken, campaignId, type) => {
  const query = `
    mutation triggerEvent($type: String!) {
      send_test_event(campaign_cursor: $campaignId, type: $type){
        event_type
        payload
        hmac
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    campaignId,
    type: toEventType(type),
  })
    .then(response => response.send_test_event)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  getEvents,
  triggerEvent,
};
