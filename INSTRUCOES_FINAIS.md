# 🚀 Instruções Finais - Importação de Dados

## ✅ Status Atual

- ✅ Tabela `leads` criada no Supabase
- ✅ Arquivo CSV convertido para SQL
- ✅ Arquivo SQL dividido em lotes menores
- ✅ Scripts de importação criados
- ✅ PostgreSQL client instalado

## 📁 Arquivos Disponíveis

### Pasta `sql_batches/`
```
📂 sql_batches/
├── 📄 00_setup.sql          (Setup inicial - RLS off)
├── 📄 01_insert_batch_1_to_55.sql  (5.408 registros)
├── 📄 02_cleanup.sql        (Cleanup final - RLS on)
└── 📄 README_INSTRUCTIONS.md
```

### Scripts Python
```
📄 import-direct-psql.py     (Importação via psql)
📄 import-batch-api.py       (Importação via API)
📄 split-sql-file.py         (Divisor de arquivos)
```

## 🎯 Método Recomendado: Supabase Dashboard

### Passo 1: Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu lateral

### Passo 2: Execute os Arquivos em Ordem

#### 2.1 Setup (PRIMEIRO)
```sql
-- Copie e cole o conteúdo de: sql_batches/00_setup.sql
-- Este arquivo desabilita RLS temporariamente
```

#### 2.2 Inserção de Dados (SEGUNDO)
```sql
-- Copie e cole o conteúdo de: sql_batches/01_insert_batch_1_to_55.sql
-- Este arquivo contém 5.408 registros em 55 lotes
-- AGUARDE a execução terminar completamente
```

#### 2.3 Cleanup (TERCEIRO)
```sql
-- Copie e cole o conteúdo de: sql_batches/02_cleanup.sql
-- Este arquivo reabilita RLS e faz verificações
```

### Passo 3: Verificação

Após executar todos os arquivos, execute estas consultas:

```sql
-- 1. Contar total de registros
SELECT COUNT(*) as total_leads FROM public.leads;
-- Resultado esperado: 5408

-- 2. Verificar alguns registros
SELECT * FROM public.leads LIMIT 5;

-- 3. Verificar campos específicos
SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT usuario_responsavel) as usuarios_unicos,
    COUNT(DISTINCT fonte_lead) as fontes_unicas
FROM public.leads;
```

## 🔧 Método Alternativo: Linha de Comando

Se preferir usar linha de comando:

```bash
# Execute o script de importação direta
python3 import-direct-psql.py

# Você precisará da senha do banco do Supabase
# Encontre em: Dashboard > Settings > Database > Connection string
```

## 📊 Dados Importados

- **Total de registros**: 5.408 leads
- **Campos principais**:
  - `lead_id`: ID único do lead
  - `usuario_responsavel`: Responsável pelo lead
  - `contato_principal`: Nome do contato
  - `email_comercial`: Email de contato
  - `telefone_comercial`: Telefone de contato
  - `fonte_lead`: Origem do lead
  - `etapa_funil`: Etapa no funil de vendas
  - `estado_onde_mora`: Estado do lead
  - E mais...

## 🎉 Próximos Passos

1. **Teste o Dashboard**: Acesse sua aplicação e verifique se os dados aparecem
2. **Verifique Filtros**: Teste filtros por estado, fonte, etc.
3. **Performance**: Monitore a performance com 5k+ registros
4. **Backup**: Considere fazer backup dos dados importados

## 🆘 Solução de Problemas

### Erro: "Query is too large"
- ✅ **Resolvido**: Arquivos divididos em lotes menores

### Erro: "Password authentication failed"
- 💡 **Solução**: Use o Supabase Dashboard em vez da linha de comando

### Erro: "Table doesn't exist"
- 💡 **Solução**: Execute primeiro o arquivo `final-import.sql` para criar a tabela

### Dados não aparecem no dashboard
- 💡 **Verificação**: Confirme se RLS foi reabilitado (arquivo 02_cleanup.sql)
- 💡 **Políticas**: Verifique se as políticas RLS estão configuradas corretamente

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no SQL Editor do Supabase
2. Execute as consultas de verificação acima
3. Confirme se todos os 3 arquivos foram executados em ordem

---

**✨ Importação preparada e pronta para execução!**