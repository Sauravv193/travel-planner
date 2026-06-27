/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFE4E9',
          200: '#FFC8D4',
          300: '#FFB6C1', // Baby pink
          400: '#FF9CB8',
          500: '#FF6B8A', // Primary hover/active
          600: '#FF4D73', // Primary button
          700: '#E62E52',
          800: '#CC2848',
          900: '#B3223E',
        },
        night: {
          bg: '#0F0F23',
          surface: '#1A1A33',
          card: '#1E1E3A',
          border: '#2A2A4A',
          text: '#E2E8F0',
          muted: '#94A3B8',
        },
      },
    },
  },
  plugins: [],
};
