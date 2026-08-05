/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'noir-bg': '#000000',
        'noir-card': '#111111',
        'noir-surface': '#1B1B1B',
        'noir-primary': '#F97316',
        'noir-primary-dark': '#C2410C', // deep rich orange/red for gradients
        'noir-accent': '#D4A017',
        'noir-danger': '#DC2626',
        'noir-border': '#27272A',
      },
      fontFamily: {
        'sans': ['PlusJakartaSans_400Regular', 'sans-serif'],
        'light': ['PlusJakartaSans_300Light', 'sans-serif'],
        'medium': ['PlusJakartaSans_500Medium', 'sans-serif'],
        'bold': ['PlusJakartaSans_700Bold', 'sans-serif'],
        'extrabold': ['PlusJakartaSans_800ExtraBold', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
