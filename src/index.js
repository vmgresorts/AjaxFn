import axios from "axios";
import qs from "qs";

const _ctokens = {};
const resolve = (variable, fallback) => {
  typeof variable === "function"
    ? variable()
    : typeof variaible === "undefined"
    ? fallback
    : variable;
};
const func = fn => (typeof fn === "function" ? fn : () => true);

/**
 * AjaxFn
 * @param {*} settings url, success, failure, finally
 * @author https://github.com/crwdzr
 */
const AjaxFn = (settings = {}) => {
  if (!settings.url) throw new Error("Missing url");
  let _cancelFn = null;
  const __index = resolve(settings.index, false);
  const payload = resolve(settings.data, {});
  const success = func(settings.success);
  const failure = func(settings.failure);
  const finalFn = func(settings.finally);
  const message = resolve(settings.message, "An unknown error occured");
  const _ctoken = new axios.CancelToken(c => (_cancelFn = c));

  if (__index) {
    if (typeof _ctokens[__index] === "function") {
      _ctokens[__index]();
    }
    _ctokens[__index] = _cancelFn;
  }

  axios
    .post(settings.url, qs.stringify(payload), { cancelToken: _ctoken })
    .then(({ data }) => {
      if (!data.status) throw data.message;
      success(data.message);
    })
    .catch(error => {
      if (typeof error === "object") {
        if (error.__CANCEL__) {
          console.log("Cancelled request to", settings.url);
          return;
        }
      }
      failure(error || message);
    })
    .finally(finalFn);

  return _cancelFn;
};

export default AjaxFn;
