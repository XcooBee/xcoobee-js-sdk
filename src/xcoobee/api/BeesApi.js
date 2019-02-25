const ApiUtils = require('./ApiUtils');

/**
 * Fetch a page of bees.
 *
 * @async
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {string} [searchText=''] - The search text.
 * @param {string} [after] - Fetch data after this cursor.
 * @param {number} [first] - The maximum count to fetch.
 *
 * @returns {Promise<Object>} - A page of bees.
 * @property {Bee[]} data - Bees for this page.
 * @property {Object} page_info - The page information.
 * @property {boolean} page_info.has_next_page - Flag indicating whether there is
 *   another page of data to may be fetched.
 * @property {string} page_info.end_cursor - The end cursor.
 *
 * @throws {XcooBeeError}
 */
const bees = (apiUrlRoot, apiAccessToken, searchText, after = null, first = null) => {
  const query = `
    query getBees($searchText: String, $after: String, $first: Int) {
      bees(search: $searchText, after: $after, first: $first) {
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
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    after,
    first,
    searchText,
  })
    .then(response => response.bees)
    .catch((err) => {
      throw ApiUtils.transformError(err);
    });
};

module.exports = {
  bees,
};
