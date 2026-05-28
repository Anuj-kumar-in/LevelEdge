import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#F4F9FC',
        'surface-2': '#F8FAFC',
        border: '#E2E8F0',
        'text-primary': '#002F56',
        'text-body': '#0F172A',
        'text-secondary': '#475569',
        'text-tertiary': '#64748B',
        accent: '#29B6F6',
        'accent-hover': '#00A3E0',
        'accent-subtle': 'rgba(41,182,246,0.08)',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        'sidebar-dark': '#0C1A2E',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(0,0,0,0.08)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
