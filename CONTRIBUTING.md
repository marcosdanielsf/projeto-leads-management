# Guia de Contribuição

Obrigado por considerar contribuir para o Sistema de Gerenciamento de Leads! 🎉

## Como Contribuir

### Reportando Bugs

Antes de reportar um bug, verifique se ele já não foi reportado nas [Issues](../../issues).

Para reportar um bug:
1. Use o template de bug report
2. Inclua passos para reproduzir o problema
3. Adicione screenshots se aplicável
4. Especifique o ambiente (OS, browser, versão do Node.js)

### Sugerindo Melhorias

Para sugerir uma nova funcionalidade:
1. Verifique se já não existe uma issue similar
2. Use o template de feature request
3. Descreva claramente o problema que a funcionalidade resolve
4. Explique como você imagina que a funcionalidade funcionaria

### Contribuindo com Código

#### Configuração do Ambiente de Desenvolvimento

1. **Fork o repositório**
2. **Clone seu fork**
   ```bash
   git clone https://github.com/seu-usuario/projeto-leads-management.git
   cd projeto-leads-management
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

#### Fluxo de Trabalho

1. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Faça suas alterações**
   - Siga os padrões de código estabelecidos
   - Adicione testes quando necessário
   - Mantenha os commits pequenos e focados

3. **Execute os testes**
   ```bash
   npm run test
   npm run lint
   ```

4. **Commit suas alterações**
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```

5. **Push para seu fork**
   ```bash
   git push origin feature/nome-da-feature
   ```

6. **Abra um Pull Request**

#### Padrões de Código

- **TypeScript**: Use tipagem forte sempre que possível
- **ESLint**: Siga as regras configuradas no projeto
- **Prettier**: Use para formatação automática
- **Commits**: Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/)

#### Estrutura de Commits

```
type(scope): description

[optional body]

[optional footer]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de build, configuração, etc

**Exemplos:**
```
feat(leads): adiciona filtro por data de criação
fix(auth): corrige erro de login com email inválido
docs(readme): atualiza instruções de instalação
```

#### Testes

- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes acima de 80%
- Use nomes descritivos para os testes
- Organize os testes em describe/it blocks

#### Documentação

- Documente APIs públicas
- Atualize o README.md se necessário
- Adicione comentários para código complexo
- Use JSDoc para funções importantes

### Pull Request Guidelines

#### Antes de Submeter

- [ ] Código segue os padrões estabelecidos
- [ ] Testes passam localmente
- [ ] Documentação foi atualizada
- [ ] Commits seguem o padrão estabelecido
- [ ] Branch está atualizada com a main

#### Template do Pull Request

```markdown
## Descrição
Descreva brevemente as alterações feitas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Commits seguem o padrão conventional
```

### Revisão de Código

Todos os PRs passam por revisão. Durante a revisão:

- Seja respeitoso e construtivo
- Explique o "porquê" dos comentários
- Sugira melhorias específicas
- Aprove quando estiver satisfeito

### Configuração do Editor

Recomendamos usar VS Code com as seguintes extensões:

- ESLint
- Prettier
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Recursos Úteis

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Dúvidas?

Se tiver dúvidas:
1. Verifique a documentação
2. Procure em issues existentes
3. Abra uma nova issue com a tag "question"
4. Entre em contato via email

---

**Obrigado por contribuir! 🚀**