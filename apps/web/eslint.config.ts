import createConfig from "@neetwork/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default createConfig({
  react: true,
}, {
  plugins: {
    "@tanstack/query": pluginQuery,
    "@tanstack/router": pluginRouter,
  },
  rules: {
    "antfu/top-level-function": "off",
    "@tanstack/query/exhaustive-deps": "error",
  },
}, {
  ignores: ["src/routeTree.gen.ts"],
}, {
  files: ["src/routes/**/*.{ts,tsx}"],
  rules: {
    "react-refresh/only-export-components": "off",
  },
});
