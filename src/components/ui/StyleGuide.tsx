'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

// Componente de seção do guia de estilo
interface StyleSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const StyleSection: React.FC<StyleSectionProps> = ({ title, description, children, className }) => {
  return (
    <section className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {children}
      </div>
    </section>
  );
};

// Componente de paleta de cores
const ColorPalette: React.FC = () => {
  const colors = {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    success: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669'
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706'
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626'
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(colors).map(([colorName, shades]) => (
        <div key={colorName}>
          <h4 className="text-lg font-medium text-gray-900 mb-3 capitalize">{colorName}</h4>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {Object.entries(shades).map(([shade, hex]) => (
              <div key={shade} className="text-center">
                <div
                  className="w-full h-16 rounded-lg border border-gray-200 mb-2"
                  style={{ backgroundColor: hex }}
                />
                <div className="text-xs text-gray-600">
                  <div className="font-medium">{shade}</div>
                  <div className="font-mono">{hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de tipografia
const Typography: React.FC = () => {
  const textStyles = [
    { name: 'Heading 1', class: 'text-4xl font-bold', example: 'Design System Premium' },
    { name: 'Heading 2', class: 'text-3xl font-bold', example: 'Componentes Avançados' },
    { name: 'Heading 3', class: 'text-2xl font-semibold', example: 'Seção de Conteúdo' },
    { name: 'Heading 4', class: 'text-xl font-semibold', example: 'Subtítulo Importante' },
    { name: 'Heading 5', class: 'text-lg font-medium', example: 'Título de Seção' },
    { name: 'Body Large', class: 'text-lg', example: 'Texto principal em destaque para leitura confortável.' },
    { name: 'Body', class: 'text-base', example: 'Texto padrão para conteúdo geral e descrições.' },
    { name: 'Body Small', class: 'text-sm', example: 'Texto secundário e informações complementares.' },
    { name: 'Caption', class: 'text-xs text-gray-500', example: 'Legendas, metadados e informações auxiliares.' },
    { name: 'Code', class: 'text-sm font-mono bg-gray-100 px-2 py-1 rounded', example: 'const example = "código"' }
  ];

  return (
    <div className="space-y-4">
      {textStyles.map((style) => (
        <div key={style.name} className="flex items-center space-x-4">
          <div className="w-24 text-sm text-gray-500 font-medium">
            {style.name}
          </div>
          <div className={cn(style.class, 'flex-1')}>
            {style.example}
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {style.class}
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de espaçamento
const Spacing: React.FC = () => {
  const spacings = [
    { name: 'xs', value: '0.25rem', class: 'space-y-1' },
    { name: 'sm', value: '0.5rem', class: 'space-y-2' },
    { name: 'md', value: '1rem', class: 'space-y-4' },
    { name: 'lg', value: '1.5rem', class: 'space-y-6' },
    { name: 'xl', value: '2rem', class: 'space-y-8' },
    { name: '2xl', value: '3rem', class: 'space-y-12' }
  ];

  return (
    <div className="space-y-6">
      {spacings.map((spacing) => (
        <div key={spacing.name}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{spacing.name}</span>
            <span className="text-xs text-gray-500">{spacing.value}</span>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <div className={spacing.class}>
              <div className="bg-blue-200 h-4 rounded"></div>
              <div className="bg-blue-200 h-4 rounded"></div>
              <div className="bg-blue-200 h-4 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de sombras
const Shadows: React.FC = () => {
  const shadows = [
    { name: 'None', class: 'shadow-none' },
    { name: 'Small', class: 'shadow-sm' },
    { name: 'Default', class: 'shadow' },
    { name: 'Medium', class: 'shadow-md' },
    { name: 'Large', class: 'shadow-lg' },
    { name: 'Extra Large', class: 'shadow-xl' },
    { name: '2XL', class: 'shadow-2xl' },
    { name: 'Inner', class: 'shadow-inner' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {shadows.map((shadow) => (
        <div key={shadow.name} className="text-center">
          <div className={cn('w-20 h-20 bg-white rounded-lg mx-auto mb-2', shadow.class)}></div>
          <div className="text-sm font-medium">{shadow.name}</div>
          <div className="text-xs text-gray-500 font-mono">{shadow.class}</div>
        </div>
      ))}
    </div>
  );
};

// Componente de bordas
const Borders: React.FC = () => {
  const borders = [
    { name: 'None', class: 'rounded-none' },
    { name: 'Small', class: 'rounded-sm' },
    { name: 'Default', class: 'rounded' },
    { name: 'Medium', class: 'rounded-md' },
    { name: 'Large', class: 'rounded-lg' },
    { name: 'Extra Large', class: 'rounded-xl' },
    { name: '2XL', class: 'rounded-2xl' },
    { name: 'Full', class: 'rounded-full' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {borders.map((border) => (
        <div key={border.name} className="text-center">
          <div className={cn('w-20 h-20 bg-blue-100 border-2 border-blue-300 mx-auto mb-2', border.class)}></div>
          <div className="text-sm font-medium">{border.name}</div>
          <div className="text-xs text-gray-500 font-mono">{border.class}</div>
        </div>
      ))}
    </div>
  );
};

// Componente de botões de exemplo
const ButtonExamples: React.FC = () => {
  const buttonVariants = [
    { name: 'Primary', class: 'bg-blue-600 text-white hover:bg-blue-700' },
    { name: 'Secondary', class: 'bg-gray-200 text-gray-900 hover:bg-gray-300' },
    { name: 'Success', class: 'bg-green-600 text-white hover:bg-green-700' },
    { name: 'Warning', class: 'bg-yellow-600 text-white hover:bg-yellow-700' },
    { name: 'Danger', class: 'bg-red-600 text-white hover:bg-red-700' },
    { name: 'Outline', class: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50' },
    { name: 'Ghost', class: 'text-blue-600 hover:bg-blue-50' },
    { name: 'Link', class: 'text-blue-600 underline hover:text-blue-800' }
  ];

  const sizes = [
    { name: 'Small', class: 'px-3 py-1.5 text-sm' },
    { name: 'Default', class: 'px-4 py-2 text-base' },
    { name: 'Large', class: 'px-6 py-3 text-lg' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-medium mb-4">Variantes</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {buttonVariants.map((variant) => (
            <button
              key={variant.name}
              className={cn(
                'px-4 py-2 rounded-md font-medium transition-colors',
                variant.class
              )}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-4">Tamanhos</h4>
        <div className="flex items-center space-x-4">
          {sizes.map((size) => (
            <button
              key={size.name}
              className={cn(
                'bg-blue-600 text-white rounded-md font-medium transition-colors hover:bg-blue-700',
                size.class
              )}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de ícones
const IconExamples: React.FC = () => {
  const icons = [
    { name: 'Home', svg: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'User', svg: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Settings', svg: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { name: 'Search', svg: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { name: 'Bell', svg: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'Heart', svg: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { name: 'Star', svg: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { name: 'Download', svg: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' }
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
      {icons.map((icon) => (
        <div key={icon.name} className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.svg} />
            </svg>
          </div>
          <div className="text-xs font-medium">{icon.name}</div>
        </div>
      ))}
    </div>
  );
};

// Componente principal do guia de estilo
export const StyleGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('colors');

  const sections = [
    { id: 'colors', name: 'Cores', component: ColorPalette },
    { id: 'typography', name: 'Tipografia', component: Typography },
    { id: 'spacing', name: 'Espaçamento', component: Spacing },
    { id: 'shadows', name: 'Sombras', component: Shadows },
    { id: 'borders', name: 'Bordas', component: Borders },
    { id: 'buttons', name: 'Botões', component: ButtonExamples },
    { id: 'icons', name: 'Ícones', component: IconExamples }
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component || ColorPalette;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Guia de Estilo Premium
        </h1>
        <p className="text-xl text-gray-600">
          Sistema de design completo com componentes profissionais
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full text-left px-4 py-2 rounded-lg font-medium transition-colors',
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <StyleSection
            title={sections.find(s => s.id === activeSection)?.name || 'Seção'}
            description={getDescription(activeSection)}
          >
            <ActiveComponent />
          </StyleSection>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Princípios de Design</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Consistência</h3>
            <p className="text-gray-600">Elementos visuais uniformes em toda a aplicação para uma experiência coesa.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
            <p className="text-gray-600">Componentes otimizados para carregamento rápido e interações fluidas.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acessibilidade</h3>
            <p className="text-gray-600">Design inclusivo que funciona para todos os usuários e dispositivos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Função auxiliar para descrições
function getDescription(sectionId: string): string {
  const descriptions: Record<string, string> = {
    colors: 'Paleta de cores consistente com tons primários, secundários e utilitários.',
    typography: 'Hierarquia tipográfica clara com tamanhos e pesos bem definidos.',
    spacing: 'Sistema de espaçamento harmonioso para layouts equilibrados.',
    shadows: 'Efeitos de sombra para criar profundidade e hierarquia visual.',
    borders: 'Variações de bordas arredondadas para diferentes contextos.',
    buttons: 'Componentes de botão com diferentes estados e variações.',
    icons: 'Biblioteca de ícones consistente para interface intuitiva.'
  };
  return descriptions[sectionId] || '';
}

export default StyleGuide;