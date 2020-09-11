const XcooBeeError = require('../core/XcooBeeError');
const ApiUtils = require('./ApiUtils');
const ConsentDataTypes = require('./ConsentDataTypes');
const ConsentStatuses = require('./ConsentStatuses');
const ConsentTypes = require('./ConsentTypes');
const { decryptWithEncryptedPrivateKey, initializeOpenpgp } = require('../core/EncryptionUtils');

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
 * Allows a company to open consent related dispute.
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
const declineConsentChange = (apiUrlRoot, apiAccessToken, consentCursor) => {
  const mutation = `
    mutation declineConsentChange($consentCursor: String!) {
      decline_consent_change(consent_cursor: $consentCursor) {
        consent_cursor
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    consentCursor,
  })
    .then((response) => {
      const { decline_consent_change } = response;

      const confirmed = decline_consent_change.consent_cursor === consentCursor;
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
 * @param {object} filters
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
const listConsents = (apiUrlRoot, apiAccessToken, userCursor, filters = {}, after = null, first = null) => {
  const query = `
  query listConsents($userCursor: String!, $statuses: [ConsentStatus], $consentTypes: [ConsentType], $dataTypes: [ConsentDatatype], $dateFrom: String, $dateTo: String, $search: String, $country: String, $province: String, $city: String, $first: Int, $after: String) {
    consents(campaign_owner_cursor: $userCursor, statuses : $statuses, consent_types: $consentTypes, data_types: $dataTypes, date_from: $dateFrom, date_to: $dateTo, search: $search, country: $country, province: $province, city: $city, first: $first, after: $after) {
        data {
          consent_cursor
          user_cursor
          user_display_name
          user_xcoobee_id
          campaign_cursor
          campaign_status
          consent_name
          consent_description
          consent_status
          consent_type
          consent_source
          consent_details {
              datatype
              marker
              share_hash
          }
          date_c
          date_e
          date_u
          date_approved
          date_deleted
          update_confirmed
          deletion_confirmed
          request_data_types
          request_data_sections {
              section_fields {
                  datatype
              }
          }
          is_data_request
          user_email_mask
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;

  const variables = {
    after,
    first,
    userCursor,
  };

  if (filters.query) {
    variables.query = filters.query;
  }

  if (filters.country) {
    variables.country = filters.country;
  }

  if (filters.province) {
    variables.province = filters.province;
  }

  if (filters.city) {
    variables.city = filters.city;
  }

  if (filters.dateFrom) {
    if (isNaN(new Date(filters.dateFrom))) {
      throw TypeError(`Invalid date string given: ${filters.dateFrom}.`);
    }

    variables.dateFrom = filters.dateFrom;
  }

  if (filters.dateTo) {
    if (isNaN(new Date(filters.dateTo))) {
      throw TypeError(`Invalid date string given: ${filters.dateTo}.`);
    }

    variables.dateTo = filters.dateTo;
  }

  if (filters.statuses && Array.isArray(filters.statuses)) {
    filters.statuses.forEach((status) => {
      if (!ConsentStatuses.values.includes(status)) {
        throw TypeError(`Invalid consent status: ${status}.  Must be one of ${ConsentStatuses.values.join(', ')}.`);
      }
    });

    variables.statuses = filters.statuses;
  }

  if (filters.consentTypes && Array.isArray(filters.consentTypes)) {
    filters.consentTypes.forEach((type) => {
      if (!ConsentTypes.values.includes(type)) {
        throw TypeError(`Invalid consent type: ${type}.  Must be one of ${ConsentTypes.values.join(', ')}.`);
      }
    });

    variables.consentTypes = filters.consentTypes;
  }

  if (filters.dataTypes && Array.isArray(filters.dataTypes)) {
    filters.dataTypes.forEach((type) => {
      if (!ConsentDataTypes.values.includes(type)) {
        throw TypeError(`Invalid consent data type: ${type}.  Must be one of ${ConsentDataTypes.values.join(', ')}.`);
      }
    });

    variables.dataTypes = filters.dataTypes;
  }

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, variables)
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
 * Requests consent from the specified user.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} message - The message to be sent to the user.
 * @param {RequestRefId} requestRef - A request reference ID generated by you that
 *   identifies this request.  This ID will be returned in the `UserDataRequest`
 *   consent events.  May be a maximum of 64 characters long.
 * @param {string} filename - The user's data being requested.
 * @param {string} targetUrl - a webhook URL that will receive processing events
 * @param {string} eventHandler - name of a function that will process POST events sent to webhook URL
 *
 * @returns {Promise<Object>} - The result.
 * @property {string} ref_id - A reference ID generated by the XcooBee system.
 *
 * @throws {XcooBeeError}
 */
const setUserDataResponse = (apiUrlRoot, apiAccessToken, message, requestRef, filename, targetUrl, eventHandler) => {
  const mutation = `
    mutation sendDataResponse($config: SendDataResponseConfig!) {
      send_data_response(config: $config) {
          ref_id
      }
    }
  `;

  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    config: {
      message,
      request_ref: requestRef,
      target_url: targetUrl,
      event_handler: eventHandler,
      filenames: [filename.replace(/^.*[\\\/]/, '')],
    },
  })
    .then((response) => response.send_data_response.ref_id)
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
 * @returns {Promise<Array>} - The result.
 * @property {Object|string} payload - The data package.
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
        await initializeOpenpgp();

        return Promise.all(response.data_package.map(async (dataPackage) => {
          const payload = await decryptWithEncryptedPrivateKey(
            dataPackage.data,
            privateKey,
            passphrase
          );

          return { payload };
        }));
      }

      return response.data_package.map((dataPackage) => ({ payload: dataPackage && dataPackage.data }));
    })
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Registers consents
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} campaignId
 * @param {?string} [filename]
 * @param {?Array<{ target: string, date_received: ?string, date_expires: ?string }>} [targets]
 * @param {?string} [reference]
 *
 * @returns {Promise<string>} - reference id
 *
 * @throws {XcooBeeError}
 */
const registerConsents = (apiUrlRoot, apiAccessToken, campaignId, filename = null, targets = [], reference = null) => {
  const query = `
    mutation registerConsents($config: RegisterConsentsConfig) {
      register_consents(config: $config) {
          ref_id
      }
    }
  `;

  return ApiUtils
    .createClient(apiUrlRoot, apiAccessToken)
    .request(query, {
      config: {
        reference,
        campaign_cursor: campaignId,
        filename,
        targets,
      },
    })
    .then(({ register_consents }) => register_consents.ref_id)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Share consents
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} campaignRef
 * @param {?string} [campaignId]
 * @param {?Array<string>} [consentIds]
 * @param {?string} [reference]
 *
 * @returns {Promise<string>} - reference id
 *
 * @throws {XcooBeeError}
 */
const shareConsents = (apiUrlRoot, apiAccessToken, campaignRef, campaignId = null, consentIds = []) => {
  if (!campaignId && !consentIds.length) {
    throw TypeError('Either campaignId or consentIds should be provided');
  }

  const query = `
    mutation shareConsents($config: ShareConsentsConfig!){
      share_consents(config: $config){
        ref_id
      }
    }
  `;

  return ApiUtils
    .createClient(apiUrlRoot, apiAccessToken)
    .request(query, {
      config: {
        campaign_reference: campaignRef,
        campaign_cursor: campaignId,
        consent_cursors: consentIds,
      },
    })
    .then(({ share_consents }) => share_consents.ref_id)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

/**
 * Set or extend `Do Not Sell Data` flag
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} email
 * @param {boolean} dontSell
 *
 * @returns {Promise<Object>} - The result.
 * @property {boolean} confirmed - Flag indicating whether the change is confirmed.
 *
 * @throws {XcooBeeError}
 */
const dontSellData = (apiUrlRoot, apiAccessToken, email, dontSell) => {
  const mutation = `
    mutation dontSellData($email: String, $dontSell: Boolean){
      do_not_sell_data(email: $email, dont_sell: $dontSell){
          user_email
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(mutation, {
    email,
    dontSell,
  })
    .then(() => true)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  confirmConsentChange,
  confirmDataDelete,
  declineConsentChange,
  getCookieConsent,
  getConsentData,
  getDataPackage,
  listConsents,
  resolveXcoobeeId,
  requestConsent,
  registerConsents,
  setUserDataResponse,
  shareConsents,
  dontSellData,
};
