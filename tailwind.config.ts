import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#2547F5',
          hover: '#1A38D4',
          subtle: '#EEF2FF',
        },
        midnight: {
          DEFAULT: '#0B1537',
          light: '#14214D',
        },
        citrus: '#D9FF43',
        tangerine: {
          DEFAULT: '#FF7048',
          dark: '#962512',
          surface: '#FFF0EB',
          border: '#FFCCBF',
        },
        verified: {
          DEFAULT: '#0E6F4B',
          surface: '#E6F5EF',
          border: '#BCE2D4',
        },
        canvas: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          muted: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
          subtle: '#F1F5F9',
          strong: '#CBD5E1',
        },
        text: {
          primary: '#0B1537',
          secondary: '#475569',
          muted: '#64748B',
          faint: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
