# AjaxFn

> it does a thing

**WARNING**
This package was specifically built for use in internal projects at VMG Resorts; this will more than likely not work in your use case. You've been warned. :)

## tl;dr use

```
import AjaxFn from '@vmgresorts/AjaxFn';

AjaxFn({
  url: "/your/api/endpoint",
  data: {
    // ...
  },
  success: res => console.log(res),
  failure: err => console.log(err),
  finally: () => console.log("done")
});
```

## Peer Dependencies

- [Axios](https://www.npmjs.com/package/axios) `^0.18.0`
- [qs](https://www.npmjs.com/package/qs) `^6.6.0`
