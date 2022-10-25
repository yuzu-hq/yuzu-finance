/* eslint-disable */

// lint-staged.config.js
module.exports = {
  "**/*.ts?(x)": (filenames) => [
    "tsc -p tsconfig.json --noEmit",
    `eslint ${filenames.join(" ")}`,
  ],
};
