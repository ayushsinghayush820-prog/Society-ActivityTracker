/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: '#0a0a0a', // Deepest background
          800: '#0F1115', // Sidebar/Base
          700: '#16181D', // Card backgrounds
          600: '#22252C', // Hover states
        },
        accent: {
          DEFAULT: '#00F0FF', // Neon Cyan for that precise instrument feel
          glow: 'rgba(0, 240, 255, 0.15)',
        },
        status: {
          active: '#00F0FF',
          low: '#8E94A0', 
          inactive: '#333333'
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Satoshi', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'], // For raw data numbers
      },
    },
  },
  plugins: [],
}