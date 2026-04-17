/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Theme colors
        know:  { DEFAULT: '#3b82f6', light: '#dbeafe' },
        trust: { DEFAULT: '#22c55e', light: '#dcfce7' },
        coop:  { DEFAULT: '#f59e0b', light: '#fef3c7' },
        emo:   { DEFAULT: '#ec4899', light: '#fce7f3' },
        creat: { DEFAULT: '#8b5cf6', light: '#ede9fe' },
      },
    },
  },
  plugins: [],
  safelist: [
    // Dynamic theme classes
    { pattern: /bg-(know|trust|coop|emo|creat)(\/[0-9]+)?/ },
    { pattern: /text-(know|trust|coop|emo|creat)/ },
    { pattern: /border-(know|trust|coop|emo|creat)/ },
    { pattern: /ring-(know|trust|coop|emo|creat)/ },
  ],
}
