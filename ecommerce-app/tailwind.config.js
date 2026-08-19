/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        paper: "#F6F4EF",
        primary: {
          DEFAULT: "#0F766E",
          50: "#E6F5F3",
          100: "#CCEBE7",
          400: "#14958A",
          500: "#0F766E",
          600: "#0C5D57",
          700: "#0A4A45",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FDE68A",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}

