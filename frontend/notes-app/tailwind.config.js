/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "extract./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2885FF",
        secondary: "#EF863E",
      },
    },
  },
  plugins: [],
}

