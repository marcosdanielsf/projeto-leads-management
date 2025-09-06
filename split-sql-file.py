#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para dividir o arquivo SQL grande em arquivos menores
Para contornar a limitação do SQL Editor do Supabase
"""

import os
import re

def split_large_sql_file(input_file, output_dir='sql_batches', records_per_file=500):
    """
    Divide um arquivo SQL grande em arquivos menores
    
    Args:
        input_file: Caminho do arquivo SQL original
        output_dir: Diretório para salvar os arquivos divididos
        records_per_file: Número de registros por arquivo
    """
    
    # Criar diretório de saída
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"📁 Criado diretório: {output_dir}")
    
    # Ler arquivo original
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"📖 Lendo arquivo: {input_file}")
    print(f"📏 Tamanho: {len(content):,} caracteres")
    
    # Extrair comandos iniciais (ALTER TABLE, etc.)
    lines = content.split('\n')
    header_commands = []
    insert_commands = []
    footer_commands = []
    
    current_section = 'header'
    current_insert = []
    
    for line in lines:
        line_stripped = line.strip()
        
        if not line_stripped or line_stripped.startswith('--'):
            if current_section == 'header':
                header_commands.append(line)
            elif current_section == 'footer':
                footer_commands.append(line)
            continue
        
        # Detectar início de INSERT
        if 'INSERT INTO' in line_stripped.upper():
            current_section = 'insert'
            current_insert = [line]
            continue
        
        # Detectar fim de INSERT
        if current_section == 'insert':
            current_insert.append(line)
            
            # Se linha termina com ); é fim do INSERT
            if line_stripped.endswith(');'):
                insert_commands.append('\n'.join(current_insert))
                current_insert = []
                continue
        
        # Detectar comandos finais (ENABLE RLS, SELECT, etc.)
        if ('ALTER TABLE' in line_stripped.upper() and 'ENABLE' in line_stripped.upper()) or \
           ('SELECT' in line_stripped.upper()):
            current_section = 'footer'
            footer_commands.append(line)
            continue
        
        # Adicionar à seção apropriada
        if current_section == 'header':
            header_commands.append(line)
        elif current_section == 'footer':
            footer_commands.append(line)
    
    print(f"📊 Encontrados:")
    print(f"   • Comandos de cabeçalho: {len([c for c in header_commands if c.strip()])}")
    print(f"   • Comandos INSERT: {len(insert_commands)}")
    print(f"   • Comandos de rodapé: {len([c for c in footer_commands if c.strip()])}")
    
    # Dividir INSERTs em lotes
    file_count = 0
    
    # Criar arquivo inicial com setup
    setup_content = '\n'.join(header_commands).strip()
    if setup_content:
        setup_file = os.path.join(output_dir, '00_setup.sql')
        with open(setup_file, 'w', encoding='utf-8') as f:
            f.write(setup_content)
        print(f"✅ Criado: {setup_file}")
    
    # Dividir INSERTs em arquivos
    for i in range(0, len(insert_commands), records_per_file):
        file_count += 1
        batch = insert_commands[i:i + records_per_file]
        
        filename = f"{file_count:02d}_insert_batch_{i+1}_to_{min(i+records_per_file, len(insert_commands))}.sql"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('-- Lote de inserção de dados\n')
            f.write(f'-- Registros {i+1} a {min(i+records_per_file, len(insert_commands))}\n\n')
            
            for insert_cmd in batch:
                f.write(insert_cmd)
                f.write('\n\n')
        
        print(f"✅ Criado: {filepath} ({len(batch)} comandos INSERT)")
    
    # Criar arquivo final com cleanup
    cleanup_content = '\n'.join(footer_commands).strip()
    if cleanup_content:
        cleanup_file = os.path.join(output_dir, f'{file_count+1:02d}_cleanup.sql')
        with open(cleanup_file, 'w', encoding='utf-8') as f:
            f.write(cleanup_content)
        print(f"✅ Criado: {cleanup_file}")
    
    # Criar arquivo de instruções
    instructions_file = os.path.join(output_dir, 'README_INSTRUCTIONS.md')
    with open(instructions_file, 'w', encoding='utf-8') as f:
        f.write(f"""# Instruções para Importação dos Dados

## Arquivos Gerados

O arquivo SQL original foi dividido em {file_count + 2} arquivos menores:

### 1. Setup (00_setup.sql)
- Desabilita RLS temporariamente
- Deve ser executado PRIMEIRO

### 2. Lotes de Inserção (01_insert_batch_*.sql)
- {file_count} arquivos com até {records_per_file} registros cada
- Execute em ordem numérica
- Aguarde cada arquivo terminar antes do próximo

### 3. Cleanup ({file_count+1:02d}_cleanup.sql)
- Reabilita RLS
- Comandos de verificação
- Deve ser executado POR ÚLTIMO

## Como Executar

### No Supabase Dashboard:

1. Acesse o **SQL Editor** no Supabase Dashboard
2. Execute os arquivos na ordem:
   ```
   00_setup.sql
   01_insert_batch_1_to_{min(records_per_file, len(insert_commands))}.sql
   02_insert_batch_{records_per_file+1}_to_{min(records_per_file*2, len(insert_commands))}.sql
   ...
   {file_count+1:02d}_cleanup.sql
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

- **Total de registros**: {len(insert_commands):,}
- **Registros por arquivo**: {records_per_file}
- **Arquivos gerados**: {file_count + 2}
- **Tamanho original**: {len(content):,} caracteres
""")
    
    print(f"\n📋 Criado arquivo de instruções: {instructions_file}")
    
    print(f"\n🎉 Divisão concluída!")
    print(f"📊 Estatísticas:")
    print(f"   • Arquivo original: {len(content):,} caracteres")
    print(f"   • Total de registros: {len(insert_commands):,}")
    print(f"   • Arquivos gerados: {file_count + 2}")
    print(f"   • Registros por arquivo: {records_per_file}")
    
    print(f"\n📁 Arquivos salvos em: {output_dir}/")
    print(f"\n💡 Próximos passos:")
    print(f"   1. Leia as instruções em: {instructions_file}")
    print(f"   2. Execute os arquivos em ordem no Supabase SQL Editor")
    print(f"   3. Comece com: {output_dir}/00_setup.sql")

def main():
    input_file = '/Users/marcosdaniels/Downloads/project/insert-leads-data.sql'
    output_dir = '/Users/marcosdaniels/Downloads/project/sql_batches'
    
    if not os.path.exists(input_file):
        print(f"❌ Arquivo não encontrado: {input_file}")
        return
    
    print("🔪 Dividindo arquivo SQL em lotes menores...")
    
    # Dividir em arquivos de 500 registros (mais conservador)
    split_large_sql_file(input_file, output_dir, records_per_file=500)

if __name__ == '__main__':
    main()