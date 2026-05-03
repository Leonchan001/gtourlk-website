/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 紙感米白 — 主要背景
        paper: {
          50:  '#fbf8f2',
          100: '#f6f1e7',
          200: '#ece4d2',
          300: '#ddd0b3',
        },
        // 墨色 — 主要文字
        ink: {
          50:  '#f4f2ee',
          100: '#dcd8d1',
          200: '#a9a39a',
          300: '#807a72',
          400: '#5a544d',
          500: '#3a3530',
          600: '#2a2622',
          700: '#1f1c19',
          800: '#171513',
          900: '#100e0c',
        },
        // 廟宇磚紅 — 唯一強調色，僅用於 CTA 與品牌點綴
        brick: {
          50:  '#faecea',
          100: '#f2cdc7',
          400: '#b34a3a',
          500: '#9a3a2a',
          600: '#7d2e21',
          700: '#5e2218',
        },
        // 印泥色 — 輔助強調
        seal: {
          500: '#a23320',
        },
      },
      fontFamily: {
        // 中文標題 — 思源宋體
        serif: ['"Noto Serif TC"', 'Georgia', 'serif'],
        // 中文內文 — 思源黑體
        sans: ['"Noto Sans TC"', 'system-ui', '-apple-system', 'sans-serif'],
        // 英文 / 數字標題 — 古典襯線
        display: ['"Cormorant Garamond"', '"Noto Serif TC"', 'serif'],
        // 標籤 / 編號 — 等寬無襯線，用於 01 / 02 編號
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
