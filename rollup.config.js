import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";

import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    external: ["axios", "qs"],
    output: {
      name: "ajaxFn",
      file: pkg.browser,
      format: "umd",
      globals: {
        axios: "axios",
        qs: "qs"
      }
    },
    plugins: [commonjs(), json()]
  },
  {
    input: "src/index.js",
    external: ["axios", "qs"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }
];
