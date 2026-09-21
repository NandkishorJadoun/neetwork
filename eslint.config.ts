import createConfig from "./packages/eslint-config/create-config.js";

export default createConfig({
  ignores: [
    "apps/api/prisma/migrations/**",
    "apps/api/public/**",
    "**/src/routeTree.gen.ts",
  ],
});
