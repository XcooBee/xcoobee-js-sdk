import ApiUtils from './ApiUtils';

/**
 *
 * @param {string} apiUrlRoot - The root of the API URL.
 * @param {ApiAccessToken} apiAccessToken - A valid API access token.
 * @param {DirectiveInput} directiveInput - The directive input.
 *
 * @returns {Promise<String>}
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

      return Promise.resolve(add_directive);
    })
    .catch(err => {
      throw ApiUtils.transformError(err);
    });
}

export default {
  addDirective,
};
