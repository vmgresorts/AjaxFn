# AjaxFn

> it does a thing

## tl;dr use

```
import AjaxFn from '@vmgresorts/AjaxFn';

AjaxFn({
  url: "/your/api/endpoint",
  success: res => console.log(res),
  failure: err => console.log(err),
  finally: () => console.log("done")
});
```

## Peer Dependencies

- [Axios](https://www.npmjs.com/package/axios) `^0.18.0`
- [qs](https://www.npmjs.com/package/qs) `^6.6.0`
