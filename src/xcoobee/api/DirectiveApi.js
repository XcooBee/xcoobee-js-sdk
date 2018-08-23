import ApiUtils from './ApiUtils';

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {DirectiveInput} directiveInput - The directive input.
 *
 * @returns {Promise<Object>} return
 * @returns {Object} return.results
 * @returns {string} return.results.ref_id
 */
export function addDirective(apiUrlRoot, apiAccessToken, directiveInput) {
  const query = `
    mutation addDirective($directiveInput: DirectiveInput!) {
      add_directive(params: $directiveInput) {
        ref_id
      }
    }
  `;
  return ApiUtils.createClient(apiUrlRoot, apiAccessToken).request(query, {
    directiveInput,
  })
    .then(response => {
      const { add_directive } = response;

      return add_directive.ref_id;
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  addDirective,
};
