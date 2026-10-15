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
      // Egy súly = egy betűcsalád: font-nunito, font-nunito-semibold, -bold, -extrabold
      fontFamily: {
        nunito: tokens.fonts.regular,
        'nunito-semibold': tokens.fonts.semibold,
        'nunito-bold': tokens.fonts.bold,
        'nunito-extrabold': tokens.fonts.extrabold,
      },
    },
  },
  plugins: [],
};
