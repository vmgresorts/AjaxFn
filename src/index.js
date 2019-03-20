import axios, { CancelToken } from "axios";
import qs from "qs";

const _ctokens = {};

/**
 * If the first arg is a function, resolve it and return its value
 * otherwise, return either the variable or its fallback value
 * @param variable
 * @param fallback
 */
const resolve = (variable, fallback) =>
  typeof variable === "function"
    ? variable()
    : typeof variable === "undefined"
    ? fallback
    : variable;

/**
 * If the argument passed is a function, return it, otherwise return something callable.
 * @param fn
 */
const func = fn => (typeof fn === "function" ? fn : () => true);

/**
 * @param {*} settings url, data, success, failure, finally
 */
export default (settings = {}) => {
  // validate that a URL exists
  if (!settings.url) throw "Missing .url";

  // deckare this for use by the cancel token later
  let _cancelFn = null;

  // resolve various settings into variables
  const __index = resolve(settings.index, false);
  const payload = resolve(settings.data, {});

  // resolve various settings into callables
  const success = func(settings.success);
  const failure = func(settings.failure);
  const finalFn = func(settings.finally);

  /**
   * Create a cancel token for our request
   */
  const _ctoken = new CancelToken(c => (_cancelFn = c));

  /**
   * Handle various xhr errors
   * @param {Object} error
   */
  const __error = function(e) {
    if (e.__CANCEL__) {
      console.warn("Cancelled request to", settings.url);
      // this will end activity without throiwng any errors,
      // a silent failure so no errors are thrown.
      return;
    }

    let message = "An unknown error has occurred";

    if (e.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (typeof e.response.data === "object") {
        // e.response.data contains the server message: "{status, code, data}"
        message = `[${e.response.status}] ${e.response.data.message}`;
      } else {
        // it's probably a network error, e.response.data won't be an object
        message = `[${e.response.status}] ${e.response.data}`;
      }
    } else if (e.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      message = `No connection to the server`;
    } else {
      // Something happened in setting up the request that triggered an Error
      // we want to pass the error outside of the scope of our try/catch here
      throw e;
    }

    if (typeof e === "object" && e.response && e.response.data) {
      console.error(
        "MESSAGE > ",
        message,
        "\n\n RESPONSE > ",
        e.response.data,
        "\n\n AXIOS > ",
        { ...e }
      );
    } else {
      console.error("MESSAGE > ", message, "\n\n ERROR > ", e);
    }

    failure(message);
  };

  /**
   * Check if we're indexing. If we are, and a cancel token exists,
   * call it as a funciton to cancel the pending request and update it
   * so that it reflects our next request.
   */
  if (__index) {
    if (typeof _ctokens[__index] === "function") {
      _ctokens[__index]();
    }
    _ctokens[__index] = _cancelFn;
  }

  axios
    .post(settings.url, qs.stringify(payload), { cancelToken: _ctoken })
    .then(response => {
      /**
       * We do this to make any requests that have 200 ok but a status of false
       * behave as if it were a RESTful failure. Legacy support because I'm an idiot
       */
      if (!response.data.status) {
        __error({
          // we have to do some remapping to make this look like what the error handler expects
          response: {
            status: 400,
            data: {
              code: 400,
              ...response.data
            }
          }
        });
      } else {
        success(response.data.message);
      }
    })
    .catch(__error)
    .finally(finalFn);
};
