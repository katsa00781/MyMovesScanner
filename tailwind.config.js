const tokens = require('./constants/theme.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.radius,
      fontSize: Object.fromEntries(
        Object.entries(tokens.fontSize).map(([name, size]) => [name, `${size}px`]),
      ),
    },
  },
  plugins: [],
};
