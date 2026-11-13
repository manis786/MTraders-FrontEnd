/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#111827',
          light: '#1f2937',
          dark: '#0b0f19'
        },
        brandOrange: {
          DEFAULT: '#FF6B00',
          hover: '#e05e00',
          light: '#ff852b'
        }
      }
    },
  },
  plugins: [],
}