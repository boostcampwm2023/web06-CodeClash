/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cafe24Ssurround", "sans-serif"],
      },
      screens: {
        "2k": "2560px",
        "4k": "3840px",
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
        defaultPattern: "url('/src/assets/img/backgroundimage.webp')",
        barPattern: "url('/src/assets/img/starteffectimage.png')",
      },
      dropShadow: {
        textShadow: "2px 4px 0 rgba(0, 0, 0, 0.25)",
        textBlack: "2px 4px 0 rgba(0, 0, 0, 1)",
      },
      borderWidth: {},
      skew: {
        left: "-7.5deg",
        right: "7.5deg",
      },
      padding: {
        "screen-min": "64px",
        "screen-max": "128px",
      },
    },
  },
  plugins: [],
};
