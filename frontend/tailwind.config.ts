import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:    '#1B2E4B',
        gold:    '#C9A84C',
        'gold-light': '#E8C97A',
        surface: '#161B22',
        border:  '#30363D',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
