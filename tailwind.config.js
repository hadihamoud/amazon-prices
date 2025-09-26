/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zobda: {
          orange: '#ff6600',
          darkOrange: '#e55a00',
          blue: '#0066cc',
          darkBlue: '#0052a3',
          gray: '#666666',
          lightGray: '#f5f5f5',
          border: '#e0e0e0',
        }
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        zobda: '0 2px 4px rgba(0,0,0,0.1)',
        zobdaHover: '0 4px 8px rgba(0,0,0,0.15)'
      }
    },
  },
  plugins: [],
}


