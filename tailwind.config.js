const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  // this should disable auto dark mode application if that's system preference
  // we'll change this once we properly update all components to support dark mode
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
