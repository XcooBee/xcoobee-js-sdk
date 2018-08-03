import ApiUtils from './ApiUtils';

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
    .then((response) => {
      const { consent } = response;

      return Promise.resolve(consent);
    }, (err) => {
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
 * @returns {Promise<Consent>}
 */
export function listConsents(apiUrlRoot, apiAccessToken, userCursor, status) {
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
    .then((response) => {
      const { consents } = response;
      const { data, page_info } = consents;

      // TODO: Find out what to do with the page_info.  If page_info.has_next_page is
      // true, then do more requests need to be made for more data?

      return Promise.resolve(data);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  getConsentData,
  listConsents,
};
