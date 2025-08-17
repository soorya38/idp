/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        'none': '0',
        DEFAULT: '0',
      },
    },
  },
  plugins: [],
};
