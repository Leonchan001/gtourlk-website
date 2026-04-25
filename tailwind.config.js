/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        forest: {
          50:  '#f0f7f2',
          100: '#dcebdf',
          200: '#bcd8c2',
          300: '#8fbc99',
          400: '#5e9a6c',
          500: '#3f7d4f',
          600: '#2d6139',
          700: '#254d2f',
          800: '#1f3e27',
          900: '#14291a',
        },
        cream: {
          50: '#fdfaf3',
          100: '#faf3e3',
          200: '#f5e7c6',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif TC"', 'serif'],
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
