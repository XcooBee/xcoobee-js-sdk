/**
 * A XcooBee specific error.
 *
 * @memberof module:core
 */
class XcooBeeError extends Error {

  /**
   * @param  {...any} args
   */
  constructor(...args) {
    // See https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
    super(...args);
    Error.captureStackTrace(this, XcooBeeError);
  }

}

// NOTE: By default, Babel does not correctly extend a class.  An instance of the
// above will still be an `Error`.  Fortunately, there is a plugin named
// 'babel-plugin-transform-builtin-extend' that extends the default behavior of
// Babel.

XcooBeeError.prototype.name = 'XcooBeeError';

export default XcooBeeError;
