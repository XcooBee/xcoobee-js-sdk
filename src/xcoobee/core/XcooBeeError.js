/**
 * A XcooBee specific error.
 */
class XcooBeeError extends Error {

  constructor(...args) {
    // See https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
    super(...args);
    Error.captureStackTrace(this, XcooBeeError);
  }

}

export default XcooBeeError;
