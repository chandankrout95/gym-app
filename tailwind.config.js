/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lime: {
          400: '#a3e635',
          500: '#84cc16',
        },
        charcoal: {
          950: '#0A0A0A',
          900: '#111111',
          800: '#1C1C1E',
          700: '#2C2C2E',
        }
      }
    },
  },
  plugins: [],
};
