/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#1E3F76",
        secondary: "#C9A644",
        primaryalt: "#DAD9D9",
        mainalt: "#F7F7F7",
        mainRed: "#E30613",
        main: "#4D4D4D",
        main2: "#F3F3F3",
        main3: "#B5B5B5",
        green: "#4CA735",
        greenBright: "#27E63A",
        greenDeep: "#11AD21",
        brightRed: "#EA4335"
      },
      fontFamily: {
        'manrope': ["Manrope", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};