#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para importar dados em lotes via API do Supabase
Divide o arquivo SQL grande em lotes menores para contornar limitações do SQL Editor
"""

import os
import re
import time
import requests
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Erro: Variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidas no .env")
    exit(1)

def execute_sql_batch(sql_commands):
    """Executa um lote de comandos SQL via API do Supabase"""
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Combinar comandos em uma única query
    combined_sql = '\n'.join(sql_commands)
    
    # Usar a API de query SQL do Supabase
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    
    # Se a função exec_sql não existir, usar query direta
    url = f"{SUPABASE_URL}/rest/v1/"
    
    # Tentar executar via PostgREST
    try:
        # Para comandos SQL diretos, usar a API de query
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/query",
            headers=headers,
            json={"query": combined_sql}
        )
        
        if response.status_code == 404:
            # Se RPC não funcionar, tentar método alternativo
            print("⚠️  Método RPC não disponível, usando inserção direta...")
            return execute_direct_insert(sql_commands)
            
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Erro na execução: {e}")
        return False

def execute_direct_insert(sql_commands):
    """Executa inserções diretas via API REST"""
    headers = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    success_count = 0
    
    for sql in sql_commands:
        if 'INSERT INTO' in sql.upper():
            # Extrair dados do INSERT para formato JSON
            try:
                # Regex para extrair valores do INSERT
                values_match = re.search(r'VALUES\s*\((.*?)\);', sql, re.DOTALL | re.IGNORECASE)
                if values_match:
                    # Processar cada linha de valores
                    values_text = values_match.group(1)
                    # Dividir por ),( para separar registros
                    records = re.split(r'\),\s*\(', values_text)
                    
                    batch_data = []
                    for record in records:
                        record = record.strip('()')
                        values = [v.strip().strip("'") for v in record.split(',')]
                        
                        # Mapear para estrutura JSON
                        lead_data = {
                            'lead_id': values[0].strip("'") if values[0] != 'NULL' else None,
                            'usuario_responsavel': values[1].strip("'") if values[1] != 'NULL' else None,
                            'contato_principal': values[2].strip("'") if values[2] != 'NULL' else None,
                            'data_criada': values[3].strip("'") if values[3] != 'NULL' else None,
                            'fonte_lead': values[4].strip("'") if values[4] != 'NULL' else None,
                            'etapa_funil': values[5].strip("'") if values[5] != 'NULL' else None,
                            'estado_onde_mora': values[6].strip("'") if values[6] != 'NULL' else None,
                            'tipo_agendamento': values[7].strip("'") if values[7] != 'NULL' else None,
                            'respostas_ia': values[8].strip("'") if values[8] != 'NULL' else None,
                            'email_comercial': values[9].strip("'") if values[9] != 'NULL' else None,
                            'telefone_comercial': values[10].strip("'") if values[10] != 'NULL' else None,
                            'estado_contato': values[11].strip("'") if values[11] != 'NULL' else None,
                            'permissao_trabalho': values[12].strip("'") if values[12] != 'NULL' else None,
                            'data_entrada_agendamento': values[13].strip("'") if values[13] != 'NULL' else None,
                            'data_hora_agendamento_bposs': values[14].strip("'") if values[14] != 'NULL' else None
                        }
                        batch_data.append(lead_data)
                    
                    # Inserir lote via API
                    if batch_data:
                        response = requests.post(
                            f"{SUPABASE_URL}/rest/v1/leads",
                            headers=headers,
                            json=batch_data
                        )
                        
                        if response.status_code in [200, 201]:
                            success_count += len(batch_data)
                            print(f"✅ Inseridos {len(batch_data)} registros")
                        else:
                            print(f"❌ Erro ao inserir lote: {response.status_code} - {response.text}")
                            
            except Exception as e:
                print(f"❌ Erro ao processar INSERT: {e}")
                continue
        
        elif 'ALTER TABLE' in sql.upper():
            # Comandos ALTER TABLE precisam ser executados via SQL direto
            print(f"⚠️  Comando ALTER TABLE deve ser executado manualmente: {sql[:50]}...")
            
    return success_count > 0

def split_sql_file(file_path, batch_size=50):
    """Divide o arquivo SQL em lotes menores"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Separar por comandos SQL
    commands = []
    current_command = []
    
    lines = content.split('\n')
    insert_count = 0
    
    for line in lines:
        line = line.strip()
        
        if not line or line.startswith('--'):
            continue
            
        current_command.append(line)
        
        # Detectar fim de comando
        if line.endswith(';'):
            command = '\n'.join(current_command)
            
            if 'INSERT INTO' in command.upper():
                # Contar registros no INSERT
                values_count = command.upper().count('VALUES')
                if values_count > 0:
                    commands.append(command)
                    insert_count += 1
                    
                    # Criar lote quando atingir o tamanho
                    if insert_count >= batch_size:
                        yield commands
                        commands = []
                        insert_count = 0
            else:
                # Comandos não-INSERT (ALTER, SELECT, etc.)
                commands.append(command)
            
            current_command = []
    
    # Retornar último lote se houver
    if commands:
        yield commands

def main():
    sql_file = '/Users/marcosdaniels/Downloads/project/insert-leads-data.sql'
    
    if not os.path.exists(sql_file):
        print(f"❌ Arquivo não encontrado: {sql_file}")
        return
    
    print("🚀 Iniciando importação em lotes...")
    print(f"📁 Arquivo: {sql_file}")
    
    batch_count = 0
    total_success = 0
    
    try:
        for batch_commands in split_sql_file(sql_file, batch_size=20):
            batch_count += 1
            print(f"\n📦 Processando lote {batch_count} ({len(batch_commands)} comandos)...")
            
            success = execute_sql_batch(batch_commands)
            
            if success:
                total_success += 1
                print(f"✅ Lote {batch_count} executado com sucesso")
            else:
                print(f"❌ Erro no lote {batch_count}")
            
            # Pausa entre lotes para evitar rate limiting
            time.sleep(1)
    
    except KeyboardInterrupt:
        print("\n⚠️  Importação interrompida pelo usuário")
    
    except Exception as e:
        print(f"\n❌ Erro durante importação: {e}")
    
    print(f"\n📊 Resumo:")
    print(f"   • Lotes processados: {batch_count}")
    print(f"   • Lotes com sucesso: {total_success}")
    print(f"   • Taxa de sucesso: {(total_success/batch_count*100):.1f}%" if batch_count > 0 else "   • Nenhum lote processado")
    
    print("\n🎉 Processo concluído!")
    print("\n💡 Próximos passos:")
    print("   1. Verifique os dados no Supabase Dashboard")
    print("   2. Execute: SELECT COUNT(*) FROM leads;")
    print("   3. Teste o dashboard da aplicação")

if __name__ == '__main__':
    main()