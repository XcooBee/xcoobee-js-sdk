/**
 * Represents a response from the SDK calls.
 *
 * @immutable
 */
class Response {

  constructor(data) {
    // TODO: Validate data.
    this._ = {
      ...data,
      time: new Date, // TODO: Format as: Y-m-d H:i:s.
    };
  }

  get code() {
    return this._.code;
  }

  get data() {
    return this._.data;
  }

  get errors() {
    return this._.errors;
  }

  get time() {
    return this._.time;
  }

}

export default Response;
