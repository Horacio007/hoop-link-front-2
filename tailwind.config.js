// tailwind.config.js (Mejorado)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Busca HTML en todas las carpetas de src (páginas, componentes, etc.)
    "./src/**/*.{html}", 
    
    // Busca clases en todos los archivos TS, importante para clases dinámicas
    "./src/**/*.{ts}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}