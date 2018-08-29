import XcooBeeError from '../core/XcooBeeError';

import ApiUtils from './ApiUtils';
import ConsentDataTypes from './ConsentDataTypes';
import ConsentStatuses from './ConsentStatuses';
import ConsentTypes from './ConsentTypes';

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
export function confirmConsentChange(apiUrlRoot, apiAccessToken, consentCursor) {
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
    .then(response => {
      const { confirm_consent_change } = response;

      const confirmed = confirm_consent_change.consent_cursor === consentCursor;
      return { confirmed };
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

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
export function confirmDataDelete(apiUrlRoot, apiAccessToken, consentCursor) {
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
    .then(response => {
      const { confirm_consent_deletion } = response;

      const confirmed = confirm_consent_deletion.consent_cursor === consentCursor;
      return { confirmed };
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
 * @param {*} xcoobeeId
 * @param {*} userCursor
 * @param {*} campaignId
 *
 * @returns {Promise<Object<ConsentDataType, boolean>>}
 */
export function getCookieConsent(apiUrlRoot, apiAccessToken, xcoobeeId, userCursor, campaignId) {
  ApiUtils.assertAppearsToBeACampaignId(campaignId);
  const query = `
    query getCookieConsent($userCursor: String!, $campaignId: String!, $status: ConsentStatus) {
      consents(campaign_owner_cursor: $userCursor, campaign_cursor: $campaignId, status: $status) {
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
    campaignId,
    status: ConsentStatuses.ACTIVE,
    userCursor,
  })
    .then(response => {
      const { consents } = response;
      const { data, page_info } = consents;

      if (page_info.has_next_page) {
        throw XcooBeeError('Too many active consents to be able to determine cookie consents. Please notify XcooBee of this issue.');
      }
      // TODO: Find out what to do with the page_info.  If page_info.has_next_page is
      // true, then do more requests need to be made for more data?

      // Unfortunately, the consents query does not yet allow searching by
      // user_xcoobee_id, multiple consent_types, or multiple request_data_types.
      // So, we have to post-process the data.
      const cookie_consents = {
        [ConsentDataTypes.ADVERTISING_COOKIE]: false,
        [ConsentDataTypes.APPLICATION_COOKIE]: false,
        [ConsentDataTypes.STATISTICS_COOKIE]: false,
        [ConsentDataTypes.USAGE_COOKIE]: false,
      };

      data.forEach(consent => {
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

      const results = { cookie_consents };
      return results;
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
 * @param {*} consentCursor
 *
 * @returns {Promise<Consent>}
 */
export function getConsentData(apiUrlRoot, apiAccessToken, consentCursor) {
  // TODO: Decide what data should be returned.
  // Additional Consent Fields:
  // - allow_affiliates
  // - campaign_cursor
  // - campaign_status
  // - consent_cursor
  // - consent_details {
  //     marker
  //     share_hash
  //   }
  // - consent_source
  // - date_approved
  // - date_deleted
  // - date_u
  // - is_data_request
  // - notes_allowed
  // - offer_expiration_date
  // - offer_points
  // - renewal_points
  // - request_data_form
  // - request_owner_cursor
  // - share_count
  // - share_type
  // - update_confirmed
  // - valid_length
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
    .then(response => {
      const { consent } = response;

      return consent;
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
 * @param {ConsentStatus} status
 *
 * @returns {Promise<Consent[]>}
 * @throws TypeError
 */
export function listConsents(apiUrlRoot, apiAccessToken, userCursor, status) {
  if (typeof status === 'string') {
    if (!ConsentStatuses.values.includes(status)) {
      throw TypeError(`Invalid consent status: ${status}.  Must be one of ${ConsentStatuses.values.join(', ')}.`);
    }
  }
  // TODO: Decide what data should be returned.
  // Additional Consent Fields:
  // - allow_affiliates
  // - campaign_cursor
  // - campaign_status
  // - consent_description
  // - consent_details {
  //     datatype
  //     marker
  //     share_hash
  //   }
  // - consent_name
  // - consent_source
  // - consent_type
  // - date_approved
  // - date_deleted
  // - date_u
  // - is_data_request
  // - notes_allowed
  // - offer_expiration_date
  // - offer_points
  // - renewal_points
  // - request_data_form
  // - request_data_types
  // - request_owner
  // - request_owner_cursor
  // - required_data_types
  // - share_count
  // - share_type
  // - update_confirmed
  // - user_cursor
  // - user_display_name
  // - valid_length
  const query = `
    query listConsents($userCursor: String!, $status: ConsentStatus) {
      consents(campaign_owner_cursor: $userCursor, status : $status) {
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
    status,
    userCursor,
  })
    .then(response => {
      const { consents } = response;
      const { data } = consents;

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
 * @param {*} xcoobeeId
 * @param {*} campaignId
 * @param {*} referenceId
 *
 * @returns {Promise<Object>}
 * @returns {Object} return.results
 * @returns {string} return.results.ref_id
 */
export function requestConsent(apiUrlRoot, apiAccessToken, xcoobeeId, campaignId, referenceId) {
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
    .then(response => {
      const { send_consent_request } = response;

      const results = { ref_id: send_consent_request.ref_id };
      return results;
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
 * @param {*} consentCursor
 *
 * @returns {Promise<string>}
 */
export function resolveXcoobeeId(apiUrlRoot, apiAccessToken, consentCursor) {
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
    .then(response => {
      const { consent } = response;

      return consent.user_xcoobee_id;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  confirmConsentChange,
  confirmDataDelete,
  getCookieConsent,
  getConsentData,
  listConsents,
  resolveXcoobeeId,
  requestConsent,
};
