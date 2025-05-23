/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9fdfff",
        primaryLight: "#c6edff",
        primaryDark: "#76bde6",
        selected: "#64b5f6",
      },
    },
  },
  plugins: [],
}