# Instruções para Importação dos Dados

## Arquivos Gerados

O arquivo SQL original foi dividido em 3 arquivos menores:

### 1. Setup (00_setup.sql)
- Desabilita RLS temporariamente
- Deve ser executado PRIMEIRO

### 2. Lotes de Inserção (01_insert_batch_*.sql)
- 1 arquivos com até 500 registros cada
- Execute em ordem numérica
- Aguarde cada arquivo terminar antes do próximo

### 3. Cleanup (02_cleanup.sql)
- Reabilita RLS
- Comandos de verificação
- Deve ser executado POR ÚLTIMO

## Como Executar

### No Supabase Dashboard:

1. Acesse o **SQL Editor** no Supabase Dashboard
2. Execute os arquivos na ordem:
   ```
   00_setup.sql
   01_insert_batch_1_to_55.sql
   02_insert_batch_501_to_55.sql
   ...
   02_cleanup.sql
   ```

3. **IMPORTANTE**: Aguarde cada arquivo terminar completamente antes de executar o próximo

4. Se algum arquivo der erro, você pode re-executá-lo individualmente

### Verificação

Após executar todos os arquivos, verifique:

```sql
-- Contar total de registros
SELECT COUNT(*) as total_leads FROM public.leads;

-- Verificar alguns registros
SELECT * FROM public.leads LIMIT 10;

-- Verificar RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'leads';
```

## Solução de Problemas

- **Erro de timeout**: Reduza o tamanho dos lotes (re-execute este script com records_per_file menor)
- **Erro de permissão**: Verifique se RLS foi desabilitado no setup
- **Dados duplicados**: Use `DELETE FROM leads WHERE lead_id = 'ID_ESPECÍFICO';` para remover duplicatas

## Estatísticas

- **Total de registros**: 55
- **Registros por arquivo**: 500
- **Arquivos gerados**: 3
- **Tamanho original**: 1,516,567 caracteres
