import createConfig from '@neetwork/eslint-config/create-config';

export default createConfig({
    ignores: ["src/db/migrations/*", "public/*"],
});
