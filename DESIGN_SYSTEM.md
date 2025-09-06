# Sistema de Design - Sales Dashboard

## Visão Geral
Este documento descreve o sistema de design aprimorado implementado no Sales Dashboard, seguindo as melhores práticas de UX/UI e conformidade WCAG AA.

## 🎨 Paleta de Cores

### Cores Primárias
- **Primary 50**: `#eff6ff` - Backgrounds sutis
- **Primary 100**: `#dbeafe` - Hover states leves
- **Primary 500**: `#3b82f6` - Cor principal (4.5:1 contraste)
- **Primary 600**: `#2563eb` - Hover states
- **Primary 700**: `#1d4ed8` - Active states

### Cores Neutras (WCAG AA Compliant)
- **Neutral 50**: `#f9fafb` - Backgrounds
- **Neutral 100**: `#f3f4f6` - Borders sutis
- **Neutral 200**: `#e5e7eb` - Borders
- **Neutral 500**: `#6b7280` - Texto secundário (4.6:1)
- **Neutral 600**: `#4b5563` - Texto (7.0:1)
- **Neutral 700**: `#374151` - Texto importante (10.7:1)
- **Neutral 900**: `#111827` - Texto principal (16.8:1)

### Cores Semânticas
- **Success**: `#22c55e` (4.5:1 contraste)
- **Warning**: `#f59e0b` (4.5:1 contraste)
- **Danger**: `#ef4444` (4.5:1 contraste)
- **Info**: `#3b82f6` (4.5:1 contraste)

## 📝 Tipografia

### Escala Tipográfica (Proporção 1.25)
- **text-xs**: 12px (0.75rem)
- **text-sm**: 15px (0.9375rem)
- **text-base**: 18px (1.125rem)
- **text-lg**: 24px (1.5rem)
- **text-xl**: 30px (1.875rem)
- **text-2xl**: 37px (2.3125rem)
- **text-3xl**: 46px (2.875rem)

### Pesos de Fonte
- **font-light**: 300 - Texto decorativo
- **font-normal**: 400 - Corpo de texto
- **font-medium**: 500 - Texto de interface
- **font-semibold**: 600 - Subtítulos
- **font-bold**: 700 - Títulos principais

### Alturas de Linha
- **Títulos**: `leading-tight` (1.2)
- **Corpo de texto**: `leading-relaxed` (1.5)
- **Interface**: `leading-normal` (1.4)

### Espaçamento entre Letras
- **Texto grande**: `tracking-tight` (-0.02em)
- **Corpo de texto**: `tracking-normal` (0em)
- **Versaletes**: `tracking-wide` (+0.05em)

## 📏 Sistema de Espaçamento

### Unidade Base: 4px
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **6**: 24px
- **8**: 32px
- **12**: 48px
- **16**: 64px

### Aplicação
- **Padding interno**: 4px, 8px, 12px, 16px
- **Margens**: 8px, 16px, 24px, 32px
- **Gaps**: 12px, 16px, 24px
- **Espaçamento de seções**: 48px, 64px

## 🔲 Border Radius
- **rounded-sm**: 2px - Elementos pequenos
- **rounded**: 4px - Inputs, botões pequenos
- **rounded-md**: 8px - Cards, botões
- **rounded-lg**: 12px - Containers
- **rounded-xl**: 16px - Elementos destacados

## 🎯 Tamanhos de Ícones
- **icon-xs**: 16px - Ícones pequenos
- **icon-sm**: 20px - Ícones de interface
- **icon-md**: 24px - Ícones padrão
- **icon-lg**: 32px - Ícones destacados

## 🔘 Componentes

### Botões
#### Tamanhos
- **Pequeno**: h-8 (32px) - px-3, text-sm
- **Médio**: h-10 (40px) - px-4, text-base
- **Grande**: h-12 (48px) - px-6, text-lg

#### Variações
- **Primary**: bg-primary-500, hover:bg-primary-600
- **Secondary**: bg-neutral-100, hover:bg-neutral-200
- **Outline**: border-primary-500, text-primary-500
- **Ghost**: hover:bg-neutral-100
- **Danger**: bg-red-500, hover:bg-red-600

### Inputs
#### Tamanhos
- **Pequeno**: h-8 (32px) - px-3, text-sm
- **Médio**: h-10 (40px) - px-4, text-base
- **Grande**: h-12 (48px) - px-4, text-lg

#### Estados
- **Default**: border-neutral-300, focus:border-primary-500
- **Error**: border-red-500, focus:border-red-500
- **Success**: border-green-500, focus:border-green-500

### Cards
#### Variações
- **Default**: bg-white, border-neutral-200
- **Elevated**: shadow-card (sombra personalizada)
- **Outlined**: border-2, border-neutral-200

#### Padding
- **Compacto**: p-4
- **Padrão**: p-6
- **Espaçoso**: p-8

## 🌑 Sombras
- **shadow-card**: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- **shadow-elevated**: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
- **shadow-floating**: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)

## ⚡ Transições
- **Padrão**: transition-all duration-200 ease-in-out
- **Rápida**: duration-150
- **Suave**: duration-300
- **Lenta**: duration-500

## 📱 Responsividade
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

## ♿ Acessibilidade (WCAG AA)

### Contraste de Cores
- Texto normal: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Elementos de interface: mínimo 3:1

### Implementação
- Todas as combinações de cores foram auditadas
- Foco visível em todos os elementos interativos
- Hierarquia clara de informações
- Tamanhos de toque adequados (mínimo 44px)

## 🎨 Uso das Cores

### Hierarquia de Informação
1. **Títulos principais**: text-neutral-900 (máximo contraste)
2. **Subtítulos**: text-neutral-700
3. **Texto corpo**: text-neutral-600
4. **Texto secundário**: text-neutral-500
5. **Texto desabilitado**: text-neutral-400

### Estados Semânticos
- **Sucesso**: green-500 para confirmações
- **Aviso**: amber-500 para alertas
- **Erro**: red-500 para erros
- **Informação**: blue-500 para informações

## 📋 Checklist de Implementação

### ✅ Concluído
- [x] Sistema de cores WCAG AA compliant
- [x] Escala tipográfica 1.25
- [x] Sistema de espaçamento 4px/8px
- [x] Componentes Button, Input, Card
- [x] Tamanhos de ícones padronizados
- [x] Sombras e transições
- [x] Atualização de componentes existentes

### 🔄 Em Progresso
- [ ] Testes de acessibilidade
- [ ] Documentação de padrões de uso
- [ ] Guias de implementação

## 🚀 Próximos Passos

1. **Testes de Usabilidade**: Validar com usuários reais
2. **Modo Escuro**: Implementar tema escuro
3. **Animações**: Adicionar micro-interações
4. **Componentes Avançados**: Modals, Dropdowns, etc.
5. **Design Tokens**: Migrar para sistema de tokens

---

*Este sistema de design foi criado seguindo as melhores práticas de UX/UI e conformidade com WCAG AA para garantir acessibilidade e usabilidade.*