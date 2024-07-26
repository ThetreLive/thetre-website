/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
   ],
  theme: {
    extend: {
      colors: {
        'thetre-blue': '#4B4BFF',
        'bg-thetre': '#111'
      },
      backgroundImage: {
        'custom-radial': 'radial-gradient(circle, rgba(8,0,255,0.7) 0%, rgba(75,75,255,0.7) 100%)',
        'bg-image': 'url(/background.png)',
        'golden-gradient': 'linear-gradient(90deg, #FFD700, #FFB14E)',
        'bg-gradient': 'radial-gradient(circle at 70% center, transparent 0%, transparent 30%, black 30%)',
      },
      fontFamily: {
        nexa: ['var(--font-nexa)'],
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--thetre-blue': theme('colors.thetre-blue'),
          '--bg-thetre': theme('colors.bg-thetre'),
        },
      });
    },
  ],
}