// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // TRÈS IMPORTANT : Active le mode basé sur les classes.
  // Tailwind regardera la présence de la classe 'dark' OU 'light'
  darkMode: 'class', // Ne changez pas ceci, même si nous utilisons 'light'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Si vous avez des couleurs personnalisées, elles iraient ici
    },
  },
  plugins: [],
}