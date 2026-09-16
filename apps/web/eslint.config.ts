import createConfig from "@neetwork/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default createConfig({
  react: true,
}, {
  rules: {
    "antfu/top-level-function": "off",
  },
}, ...pluginRouter.configs["flat/recommended"], ...pluginQuery.configs["flat/recommended-strict"], {
  ignores: ["src/routeTree.gen.ts"],
}, {
  files: ["src/routes/**/*.{ts,tsx}"],
  rules: {
    "react-refresh/only-export-components": "off",
  },
});
