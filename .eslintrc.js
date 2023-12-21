const { defineConfig } = require("eslint-define-config")

module.exports = defineConfig({
  env: {
    node: true,
    es6: true,
    es2021: true,
  },

  extends: ["eslint:recommended", "plugin:prettier/recommended"],

  plugins: ["prettier"],

  rules: {
    "prettier/prettier": ["error"],
  },
})
