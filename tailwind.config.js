/** @type {import('tailwindcss').Config} */
export default {
  // This is where we define which files will use Tailwind styling
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  // Here we can decide a theme to use
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}

