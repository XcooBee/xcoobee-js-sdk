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

export default {
  getConsentData,
};
