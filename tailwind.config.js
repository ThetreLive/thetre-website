/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
   ],
  theme: {
    extend: {
      colors: {
        'thetre-blue': '#4B4BFF',
      },
      backgroundImage: {
        'custom-radial': 'radial-gradient(circle, rgba(8,0,255,0.7) 0%, rgba(75,75,255,0.7) 100%)',
      },
    },
  },
  plugins: [],
}