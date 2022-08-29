const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./**/*.html", "./src/**/*.ts", "./src/**/*.tsx"],
  theme: {
    extend: {
      aspectRatio: {
        "4/3": "4/3",
        "3/4": "3/4",
      },
      fontFamily: {
        "dm-serif": ["DM Serif Display", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
