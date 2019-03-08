import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import builtins from "rollup-plugin-node-builtins";

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
    plugins: [commonjs(), json(), builtins()]
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
