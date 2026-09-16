import createConfig from "@neetwork/eslint-config/create-config";

export default createConfig({
  ignores: ["prisma/migrations/**", "public/**"],
  rules: {
    "test/no-import-node-test": "off",
  },
}).append({
  files: ["src/configs/env.ts"],
  rules: {
    "n/no-process-env": "off",
  },
});
