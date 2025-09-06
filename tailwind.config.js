/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Sistema de Tipografia - Escala 1.25
      fontSize: {
        'xs': ['12px', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        'sm': ['15px', { lineHeight: '1.5', letterSpacing: '0' }],
        'base': ['18px', { lineHeight: '1.5', letterSpacing: '0' }],
        'lg': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'xl': ['30px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '2xl': ['37px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '3xl': ['46px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      
      // Sistema de Cores Premium Dark Theme
      colors: {
        // Premium Dark Theme Colors
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        neon: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#af44ca', // Primary neon color
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // 4.5:1 contrast ratio
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // 4.5:1 contrast ratio
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Background colors
        bg: {
          primary: '#0a0e1a',
          secondary: '#111827',
          tertiary: '#1f2937',
          accent: '#374151',
        },
        // Text colors
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
          inverse: '#0f172a',
        },
        semantic: {
          success: {
            50: '#f0fdf4',
            500: '#22c55e',
            700: '#15803d',
          },
          warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            700: '#d97706',
          },
          error: {
            50: '#fef2f2',
            500: '#ef4444',
            700: '#dc2626',
          },
          info: {
            50: '#eff6ff',
            500: '#3b82f6',
            700: '#1d4ed8',
          },
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // 4.5:1 contrast ratio
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      
      // Sistema de Espaçamento baseado em 4px/8px
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      
      // Sistema de Border Radius
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      
      // Alturas de Componentes
      height: {
        'btn-sm': '32px',
        'btn-md': '40px',
        'btn-lg': '48px',
        'input-sm': '32px',
        'input-md': '40px',
        'input-lg': '48px',
      },
      
      // Tamanhos de Ícones
      width: {
        'icon-xs': '16px',
        'icon-sm': '20px',
        'icon-md': '24px',
        'icon-lg': '32px',
      },
      
      // Sistema de Sombras Sofisticado - Múltiplos Níveis de Elevação
      boxShadow: {
        // Elevação Básica (0-2)
        'none': 'none',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        
        // Elevação Baixa (2-4)
        'card': '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 3px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 8px -2px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.08)',
        
        // Elevação Média (4-8)
        'elevated': '0 6px 12px -2px rgba(0, 0, 0, 0.15), 0 3px 6px -2px rgba(0, 0, 0, 0.1)',
        'floating': '0 8px 16px -4px rgba(0, 0, 0, 0.18), 0 4px 8px -2px rgba(0, 0, 0, 0.12)',
        
        // Elevação Alta (8-16)
        'modal': '0 12px 24px -4px rgba(0, 0, 0, 0.25), 0 6px 12px -2px rgba(0, 0, 0, 0.15)',
        'dropdown': '0 16px 32px -8px rgba(0, 0, 0, 0.3), 0 8px 16px -4px rgba(0, 0, 0, 0.2)',
        
        // Elevação Premium (16-24)
        'premium': '0 20px 40px -8px rgba(0, 0, 0, 0.35), 0 10px 20px -4px rgba(0, 0, 0, 0.25)',
        'hero': '0 24px 48px -12px rgba(0, 0, 0, 0.4), 0 12px 24px -6px rgba(0, 0, 0, 0.3)',
        
        // Efeitos Especiais
        'neon': '0 0 20px rgba(175, 68, 202, 0.3), 0 0 40px rgba(175, 68, 202, 0.1)',
        'neon-lg': '0 0 30px rgba(175, 68, 202, 0.4), 0 0 60px rgba(175, 68, 202, 0.2)',
        'neon-xl': '0 0 40px rgba(175, 68, 202, 0.5), 0 0 80px rgba(175, 68, 202, 0.3)',
        
        // Glassmorphism
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.4)',
        'glass-xl': '0 24px 96px 0 rgba(31, 38, 135, 0.45)',
        
        // Sombras Coloridas
        'primary': '0 8px 16px -4px rgba(59, 130, 246, 0.3), 0 4px 8px -2px rgba(59, 130, 246, 0.2)',
        'secondary': '0 8px 16px -4px rgba(34, 197, 94, 0.3), 0 4px 8px -2px rgba(34, 197, 94, 0.2)',
        'warning': '0 8px 16px -4px rgba(245, 158, 11, 0.3), 0 4px 8px -2px rgba(245, 158, 11, 0.2)',
        'danger': '0 8px 16px -4px rgba(239, 68, 68, 0.3), 0 4px 8px -2px rgba(239, 68, 68, 0.2)',
        
        // Sombras Internas
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        
        // Sombras de Texto
        'text': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'text-lg': '0 2px 4px rgba(0, 0, 0, 0.6)',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      },
      
      // Font Family
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      
      // Animações Premium
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      
      // Keyframes Premium
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(175, 68, 202, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(175, 68, 202, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      // Transições Premium
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};
