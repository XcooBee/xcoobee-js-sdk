import ApiUtils from './ApiUtils';

/**
 *
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} [searchText=''] - The search text.
 *
 * @returns {Promise<Bees[]>}
 */
export function bees(apiAccessToken, searchText) {
  const query = `
    query getBees($searchText: String) {
      bees(search: $searchText) {
        data {
          bee_icon
          bee_system_name
          category
          cursor
          date_c,
          description
          input_extensions
          input_file_types
          is_file_reader
          label
          max_filesize
          output_extensions
          output_file_types
          owner_cursor
          owner_xcoobee_id
        }
        page_info {
          end_cursor
          has_next_page
        }
      }
    }
  `;
  return ApiUtils.createClient(apiAccessToken).request(query, {
    searchText,
  })
    .then((response) => {
      const { bees } = response;
      const { data, page_info } = bees;

      // TODO: Find out what to do with the page_info.  If page_info.has_next_page is
      // true, then do more requests need to be made for more data?

      return Promise.resolve(data);
    }, (err) => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  bees,
};
