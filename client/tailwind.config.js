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
        linkedin: {
          50: '#eef6fc',
          100: '#d7ecf8',
          200: '#b4dbf3',
          300: '#80c2eb',
          400: '#46a3df',
          500: '#1b85cf',
          600: '#0a66c2', // Primary LinkedIn Blue
          700: '#08529d',
          800: '#004182', // Hover Dark Blue
          900: '#09223b',
          bg: '#f4f2ee',  // Signature LinkedIn page background
          card: '#ffffff',
          border: '#e0dfdc',
          text: '#191919',
          muted: '#666666',
          gold: '#915907',
          goldbg: '#f8c77e',
        },
        surface: {
          light: '#f4f2ee',
          card: '#ffffff',
          dark: '#1d2226',
          darkcard: '#293138',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'system-ui', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'linkedin': '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'linkedin-hover': '0 0 0 1px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
        'dropdown': '0 4px 16px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}
