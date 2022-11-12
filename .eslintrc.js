module.exports = {
  ignorePatterns: ["node_modules/"],
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
  },
  plugins: ["prettier", "@typescript-eslint"],
  rules: {
    "no-console": "error",
    "no-undef": "off",
    "no-debugger": "error",
    "prettier/prettier": "error",
    "prefer-const": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-unused-vars": "error",
    // Support for no react import
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "off",
  },
};
