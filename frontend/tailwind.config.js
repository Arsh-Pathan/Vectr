/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853',
        },
        primary: {
          bg: '#FFFFFF',
          text: '#202124',
        },
        secondary: {
          bg: '#F8F9FA',
          text: '#5F6368',
        },
        tertiary: {
          bg: '#F1F3F4',
          text: '#80868B',
        },
        border: '#DADCE0',
        tier: {
          beginner: '#34A853',
          moderate: '#FBBC05',
          advanced: '#EA4335',
          expert: '#4285F4',
        }
      },
      fontFamily: {
        sans: ['Google Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Google Sans Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(60, 64, 67, 0.15), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
        md: '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
    },
  },
  plugins: [],
}

