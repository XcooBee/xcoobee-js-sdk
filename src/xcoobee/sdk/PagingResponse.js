import ErrorResponse from './ErrorResponse';
import Response from './Response';

class PagingResponse extends Response {

  constructor(fetcher, currentPage, apiCfg, params) {
    super({
      apiCfg,
      code: 200,
      currentPage,
      error: null,
      fetcher,
      hasNextPage: currentPage.page_info.has_next_page,
      params,
      results: currentPage,
    });
  }

  async getNextPage() {
    if (this.hasNextPage()) {
      const { apiCfg, currentPage, fetcher, params } = this._;
      const nextParams = {
        ...params,
        after: currentPage.page_info.end_cursor,
        first: null,
      };
      try {
        const nextPage = this._.fetcher(apiCfg, nextParams);
        return new PagingResponse(fetcher, nextPage, apiCfg, params);
      }
      catch (err) {
        return new ErrorResponse(400, err);
      }
    }
    return null;
  }

}

export default PagingResponse;
