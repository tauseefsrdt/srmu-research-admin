/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f6',
          500: '#0c87eb',
          600: '#0268c7',
          700: '#0A4A8F', // SRMU Deep Royal Blue
          800: '#073c75',
          900: '#0b3360',
          950: '#072040',
        },
        gold: {
          400: '#ffc83b',
          500: '#FFB703', // SRMU Amber Gold
          600: '#e09800',
        }
      },
      fontFamily: {
        sans: ['Rubik', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Rubik', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
