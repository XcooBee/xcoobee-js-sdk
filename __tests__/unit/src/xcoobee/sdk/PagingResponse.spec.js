const jest = require('jest-mock');

const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');

describe('PagingResponse', () => {

  describe('constructor', () => {

    it('should create PagingResponse instance', () => {
      const fetcher = jest.fn();

      const response = new PagingResponse(fetcher, { data: 'result', page_info: {} }, 'apiConfig', 'params');

      expect(response.code).toBe(200);
      expect(response.result.data).toBe('result');
      expect(response.error).toBeNull();
    });

  });

  describe('getNextPage', () => {

    it('should return null if there is no next page', () => {
      const fetcher = jest.fn();

      const response = new PagingResponse(fetcher, { data: 'result', page_info: {} }, 'apiConfig', 'params');

      return response.getNextPage()
        .then(res => expect(res).toBeNull());
    });

    it('should return ErrorResponse', () => {
      const fetcher = jest.fn(() => Promise.reject({ message: 'error' }));

      const response = new PagingResponse(fetcher, { data: 'result', page_info: { has_next_page: true, end_cursor: 'end_cursor' } }, 'apiConfig', { param1: 'test' });

      return response.getNextPage()
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(fetcher).toHaveBeenCalled();
          expect(fetcher).toHaveBeenCalledWith('apiConfig', {
            param1: 'test',
            after: 'end_cursor',
          });

          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should return PagingResponse', () => {
      const fetcher = jest.fn(() => Promise.resolve({ data: 'data', page_info: { has_next_page: false } }));

      const response = new PagingResponse(fetcher, { data: 'result', page_info: { has_next_page: true, end_cursor: 'end_cursor' } }, 'apiConfig', { param1: 'test' });

      return response.getNextPage()
        .then((res) => {
          expect(fetcher).toHaveBeenCalled();
          expect(fetcher).toHaveBeenCalledWith('apiConfig', {
            param1: 'test',
            after: 'end_cursor',
          });

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data).toBe('data');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

});
