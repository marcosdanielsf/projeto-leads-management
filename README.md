# Sistema de Gerenciamento de Leads

Um sistema completo de gerenciamento de leads desenvolvido com React, TypeScript, Supabase e Tailwind CSS.

## 📋 Funcionalidades

- ✅ Interface moderna e responsiva
- ✅ Autenticação de usuários
- ✅ CRUD completo de leads
- ✅ Filtros e busca avançada
- ✅ Dashboard com métricas
- ✅ Importação de dados CSV
- ✅ Sistema de tags e categorização
- ✅ Exportação de relatórios

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **React Router** - Roteamento SPA

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança a nível de linha

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Processador CSS
- **Node.js** - Runtime JavaScript

## 📁 Estrutura do Projeto

```
project/
├── src/                    # Código fonte da aplicação
│   ├── components/         # Componentes React reutilizáveis
│   ├── contexts/          # Contextos React (Auth, etc.)
│   ├── lib/               # Configurações e utilitários
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços de API
│   ├── types/             # Definições de tipos TypeScript
│   └── utils/             # Funções utilitárias
├── supabase/              # Configurações do Supabase
│   └── migrations/        # Migrações do banco de dados
├── sql_batches/           # Scripts SQL para importação
├── public/                # Arquivos estáticos
├── dist/                  # Build de produção
└── scripts/               # Scripts de importação e utilitários
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd projeto-leads-management
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Configure o banco de dados
Execute as migrações do Supabase:
```bash
npx supabase db reset
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📊 Scripts de Importação de Dados

O projeto inclui vários scripts para importação de dados CSV:

- `import-auto-supabase.py` - Importação automática via API do Supabase
- `import-batch-api.py` - Importação em lotes via API
- `import-direct-psql.py` - Importação direta no PostgreSQL
- `csv-to-sql.py` - Conversão de CSV para SQL
- `split-sql-file.py` - Divisão de arquivos SQL grandes

### Uso dos scripts de importação:
```bash
# Converter CSV para SQL
python csv-to-sql.py

# Importar via API do Supabase
python import-auto-supabase.py

# Importar diretamente no PostgreSQL
python import-direct-psql.py
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `leads`
- `id` - UUID (chave primária)
- `nome` - Nome do lead
- `email` - Email do lead
- `telefone` - Telefone do lead
- `empresa` - Empresa do lead
- `status` - Status do lead (novo, contatado, qualificado, etc.)
- `origem` - Origem do lead
- `valor_potencial` - Valor potencial do negócio
- `observacoes` - Observações adicionais
- `created_at` - Data de criação
- `updated_at` - Data de atualização
- `user_id` - ID do usuário (para RLS)

## 🔐 Autenticação e Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado
- Políticas de segurança por usuário
- Validação de dados no frontend e backend

## 📱 Funcionalidades da Interface

### Dashboard
- Métricas de leads por status
- Gráficos de conversão
- Leads recentes
- Estatísticas gerais

### Gerenciamento de Leads
- Lista paginada de leads
- Filtros por status, origem, data
- Busca por nome, email, empresa
- Edição inline
- Exclusão com confirmação

### Importação de Dados
- Upload de arquivos CSV
- Mapeamento de colunas
- Validação de dados
- Preview antes da importação

## 🚀 Deploy

### Build para produção
```bash
npm run build
```

### Deploy no Vercel/Netlify
1. Conecte o repositório
2. Configure as variáveis de ambiente
3. Deploy automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando React + Supabase**