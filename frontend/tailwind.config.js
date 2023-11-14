/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cafe24Ssurround", "sans-serif"],
      },
      colors: {
        pink: "#F90196",
        skyblue: "#33C9EA",
        lightskyblue: "#B5E8FA",
        yellow: "#FEB938",
        black: "#222126",
        white: "#FEFEFD",
      },
      backgroundImage: {
        defaultPattern: "url('/src/assets/img/backgroundimage.png')",
      },
      dropShadow: {
        textShadow: "2px 4px 0 rgba(0, 0, 0, 0.25)",
      },
      borderWidth: {},
    },
  },
  plugins: [],
};
