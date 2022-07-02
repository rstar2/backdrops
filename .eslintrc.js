module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    parserOptions: {
        sourceType: "module",
    },
    extends: ["eslint:recommended", "airbnb", "prettier"],
    plugins: ["prettier"],
    rules: {
        "no-console": "error",
        "@typescript-eslint/no-non-null-assertion": "off",
        "prettier/prettier": "error",
    },
};
