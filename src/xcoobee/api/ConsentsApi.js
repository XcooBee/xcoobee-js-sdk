const XcooBeeError = require('../core/XcooBeeError');
const ApiUtils = require('./ApiUtils');
const ConsentDataTypes = require('./ConsentDataTypes');
const ConsentStatuses = require('./ConsentStatuses');
const ConsentTypes = require('./ConsentTypes');
const { decryptWithEncryptedPrivateKey } = require('../core/EncryptionUtils');

/**
 * Allows a company to confirm consent data modification.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} consentCursor
 *
 * @returns {Promise<Object>} - The result.
 * @property {boolean} confirmed - Flag indicating whether the change is confirmed.
 *
 * @throws {XcooBeeError}
 */
const confirmConsentChange = (apiUrlRoot, apiAccessToken, consentCursor) => {
  const mutation = `
    mutation confirmConsentChange($consentCursor: String!) {
      confirm_consent_change(consent_cursor: $consentCursor) {
        consent_cursor
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    consentCursor,
  })
    .then((response) => {
      const { confirm_consent_change } = response;

      const confirmed = confirm_consent_change.consent_cursor === consentCursor;
      return { confirmed };
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Allows a company to confirm consent data deletion.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} consentCursor
 *
 * @returns {Promise<Object>} - The result.
 * @property {boolean} confirmed - Flag indicating whether the consent data was
 *   deleted.
 *
 * @throws {XcooBeeError}
 */
const confirmDataDelete = (apiUrlRoot, apiAccessToken, consentCursor) => {
  const mutation = `
    mutation confirmDataDelete($consentCursor: String!) {
      confirm_consent_deletion(consent_cursor: $consentCursor) {
        consent_cursor
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    consentCursor,
  })
    .then((response) => {
      const { confirm_consent_deletion } = response;

      const confirmed = confirm_consent_deletion.consent_cursor === consentCursor;
      return { confirmed };
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches an existing user's cookie consent information.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} xcoobeeId
 * @param {*} userCursor
 * @param {*} campaignId
 *
 * @returns {Promise<Object>} - The result.
 * @property {Object<ConsentDataType, boolean>} cookie_consents - The cookie consent
 *   information.
 *
 * @throws {XcooBeeError}
 */
const getCookieConsent = (apiUrlRoot, apiAccessToken, xcoobeeId, userCursor, campaignId) => {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const query = `
    query getCookieConsent($userCursor: String!, $campaignIds: [String!]!, $statuses: [ConsentStatus]) {
      consents(campaign_owner_cursor: $userCursor, campaign_cursors: $campaignIds, statuses: $statuses) {
        data {
          consent_type,
          request_data_types,
          user_xcoobee_id,
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    campaignIds: [campaignId],
    statuses: [ConsentStatuses.ACTIVE],
    userCursor,
  })
    .then((response) => {
      const { consents } = response;
      const { data, page_info } = consents;

      if (page_info.has_next_page) {
        throw XcooBeeError('Too many active consents to be able to determine cookie consents. Please notify XcooBee of this issue.');
      }

      const cookie_consents = {
        [ConsentDataTypes.ADVERTISING_COOKIE]: false,
        [ConsentDataTypes.APPLICATION_COOKIE]: false,
        [ConsentDataTypes.STATISTICS_COOKIE]: false,
        [ConsentDataTypes.USAGE_COOKIE]: false,
      };

      data.forEach((consent) => {
        if (consent.user_xcoobee_id === xcoobeeId) {
          if ([ConsentTypes.WEB_APPLICATION_TRACKING, ConsentTypes.WEBSITE_TRACKING].includes(consent.consent_type)) {
            if (consent.request_data_types.includes(ConsentDataTypes.ADVERTISING_COOKIE)) {
              cookie_consents[ConsentDataTypes.ADVERTISING_COOKIE] = true;
            }
            if (consent.request_data_types.includes(ConsentDataTypes.APPLICATION_COOKIE)) {
              cookie_consents[ConsentDataTypes.APPLICATION_COOKIE] = true;
            }
            if (consent.request_data_types.includes(ConsentDataTypes.STATISTICS_COOKIE)) {
              cookie_consents[ConsentDataTypes.STATISTICS_COOKIE] = true;
            }
            if (consent.request_data_types.includes(ConsentDataTypes.USAGE_COOKIE)) {
              cookie_consents[ConsentDataTypes.USAGE_COOKIE] = true;
            }
          }
        }
      });

      return { cookie_consents };
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches the consent data with the specified ID.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} consentCursor
 *
 * @returns {Promise<Object>} - The result.
 * @property {Consent} consent - The consent data.
 *
 * @throws {XcooBeeError}
 */
const getConsentData = (apiUrlRoot, apiAccessToken, consentCursor) => {
  const query = `
    query getConsentData($consentCursor: String!) {
      consent(consent_cursor: $consentCursor) {
        consent_description
        consent_details {
          datatype
        }
        consent_name
        consent_status
        consent_type
        date_c
        date_e
        request_data_types
        request_owner
        required_data_types
        user_cursor
        user_display_name
        user_xcoobee_id
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    consentCursor,
  })
    .then((response) => {
      const { consent } = response;

      return { consent };
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Fetches a page of consents with the given status.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} userCursor
 * @param {ConsentStatus[]} statuses
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>} - A page of the inbox.
 * @property {Consent[]} data - Consents for this page.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const listConsents = (apiUrlRoot, apiAccessToken, userCursor, statuses = [], after = null, first = null) => {
  if (!Array.isArray(statuses)) {
    throw TypeError('`statuses` should be array');
  }

  statuses.forEach((status) => {
    if (typeof status === 'string') {
      if (!ConsentStatuses.values.includes(status)) {
        throw TypeError(`Invalid consent status: ${status}.  Must be one of ${ConsentStatuses.values.join(', ')}.`);
      }
    }
  });

  const query = `
    query listConsents($userCursor: String!, $statuses: [ConsentStatus], $after: String, $first: Int) {
      consents(campaign_owner_cursor: $userCursor, statuses: $statuses, after: $after, first: $first) {
        data {
          consent_cursor,
          consent_status,
          date_c,
          date_e,
          user_xcoobee_id,
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
    statuses: statuses.length ? statuses : null,
    userCursor,
  })
    .then((response) => {
      const { consents } = response;

      return consents;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Requests consent from the specified user.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} xcoobeeId - The XcooBee ID from which consent is being requested.
 * @param {*} campaignId
 * @param {*} referenceId
 *
 * @returns {Promise<Object>} - The result.
 * @property {string} ref_id - A reference ID generated by the XcooBee system.
 *
 * @throws {XcooBeeError}
 */
const requestConsent = (apiUrlRoot, apiAccessToken, xcoobeeId, campaignId, referenceId) => {
  const mutation = `
    mutation requestConsent($config: AdditionalRequestConfig) {
      send_consent_request(config: $config) {
        ref_id
      }
    }
  `;

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: {
      campaign_cursor: campaignId,
      reference: referenceId,
      xcoobee_id: xcoobeeId,
    },
  })
    .then((response) => {
      const { send_consent_request } = response;

      const result = { ref_id: send_consent_request.ref_id };
      return result;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};


/**
 * TODO: Complete documentation.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {*} consentCursor
 *
 * @returns {Promise<string>}
 */
const resolveXcoobeeId = (apiUrlRoot, apiAccessToken, consentCursor) => {
  const query = `
    query resolveXcoobeeId($consentCursor: String!) {
      consent(consent_cursor: $consentCursor) {
        user_xcoobee_id
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    consentCursor,
  })
    .then((response) => {
      const { consent } = response;

      return consent.user_xcoobee_id;
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Return consent data package
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} consentId
 * @param {string} privateKey
 * @param {string} passphrase
 *
 * @returns {Promise<Object>} - The result.
 * @property {boolean} confirmed - Flag indicating whether the change is confirmed.
 *
 * @throws {XcooBeeError}
 */
const getDataPackage = (apiUrlRoot, apiAccessToken, consentId, privateKey, passphrase) => {
  const query = `
    query getDataPackage($consentId: String!) {
      data_package(consent_cursor: $consentId) {
          data
      }
    }
  `;

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    consentId,
  })
    .then(async (response) => {
      if (privateKey && passphrase) {
        const payloadJson = await decryptWithEncryptedPrivateKey(
          response.data_package.data,
          privateKey,
          passphrase
        );

        return { payload: JSON.parse(payloadJson) };
      }

      return { payload: response.data_package && response.data_package.data };
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  confirmConsentChange,
  confirmDataDelete,
  getCookieConsent,
  getConsentData,
  listConsents,
  resolveXcoobeeId,
  requestConsent,
  getDataPackage,
};
