/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      'blue': '#3060BF',
      'red': '#F94776',
      'yellow': '#F6D54B',
      'green': '#4CAF50'
    },
    extend: {
      fontFamily: {
        sans: ['Inter var'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

