/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#7765DA",
          600: "#5767D0",
          700: "#4F0DCE",
        },
        gray: {
          100: "#F2F2F2",
          800: "#373737",
          900: "#1A1A1A",
          600: "#6E6E6E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
