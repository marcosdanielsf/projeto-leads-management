#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para importar dados diretamente via psql
Usa conexão direta com PostgreSQL do Supabase
"""

import os
import subprocess
import time
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

def get_db_connection_string():
    """Monta string de conexão do banco"""
    supabase_url = os.getenv('VITE_SUPABASE_URL')
    
    if not supabase_url:
        print("❌ VITE_SUPABASE_URL não encontrada no .env")
        return None
    
    # Extrair o projeto ID da URL
    project_id = supabase_url.replace('https://', '').replace('.supabase.co', '')
    
    # String de conexão (usuário precisará inserir a senha)
    connection_string = f"postgresql://postgres@db.{project_id}.supabase.co:5432/postgres"
    
    return connection_string

def execute_sql_file_psql(sql_file, connection_string):
    """Executa arquivo SQL via psql"""
    try:
        print(f"📄 Executando: {os.path.basename(sql_file)}")
        
        # Comando psql
        cmd = [
            'psql',
            connection_string,
            '-f', sql_file,
            '-v', 'ON_ERROR_STOP=1'
        ]
        
        # Executar comando
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ {os.path.basename(sql_file)} executado com sucesso")
            if result.stdout:
                # Mostrar apenas as últimas linhas do output
                lines = result.stdout.strip().split('\n')
                if len(lines) > 5:
                    print(f"📋 Output (últimas linhas): ...{chr(10).join(lines[-3:])}")
                else:
                    print(f"📋 Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ Erro ao executar {os.path.basename(sql_file)}")
            if result.stderr:
                print(f"🔍 Erro: {result.stderr.strip()}")
            return False
            
    except FileNotFoundError:
        print("❌ psql não encontrado. Instale PostgreSQL client primeiro.")
        print("💡 No macOS: brew install postgresql")
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("🚀 Importação direta via psql")
    
    # Obter string de conexão
    connection_string = get_db_connection_string()
    if not connection_string:
        return
    
    print(f"🔗 Conexão: {connection_string}")
    print("\n⚠️  IMPORTANTE: Você precisará inserir a senha do banco quando solicitado.")
    print("💡 A senha está no Supabase Dashboard > Settings > Database")
    
    sql_batches_dir = '/Users/marcosdaniels/Downloads/project/sql_batches'
    
    if not os.path.exists(sql_batches_dir):
        print(f"❌ Diretório não encontrado: {sql_batches_dir}")
        return
    
    # Lista de arquivos em ordem
    sql_files = [
        '00_setup.sql',
        '01_insert_batch_1_to_55.sql', 
        '02_cleanup.sql'
    ]
    
    print(f"\n📁 Diretório: {sql_batches_dir}")
    print(f"📦 Arquivos a processar: {len(sql_files)}")
    
    # Confirmar antes de continuar
    response = input("\n❓ Continuar com a importação? (s/N): ")
    if response.lower() not in ['s', 'sim', 'y', 'yes']:
        print("❌ Importação cancelada.")
        return
    
    success_count = 0
    
    for i, sql_file in enumerate(sql_files, 1):
        file_path = os.path.join(sql_batches_dir, sql_file)
        
        if not os.path.exists(file_path):
            print(f"⚠️  Arquivo não encontrado: {sql_file}")
            continue
        
        print(f"\n📦 [{i}/{len(sql_files)}] Processando: {sql_file}")
        
        # Mostrar tamanho do arquivo
        file_size = os.path.getsize(file_path)
        print(f"📏 Tamanho: {file_size:,} bytes")
        
        # Executar arquivo
        success = execute_sql_file_psql(file_path, connection_string)
        
        if success:
            success_count += 1
            print(f"✅ [{i}/{len(sql_files)}] Concluído: {sql_file}")
        else:
            print(f"❌ [{i}/{len(sql_files)}] Falha: {sql_file}")
            
            # Perguntar se deve continuar
            if i < len(sql_files):
                response = input("❓ Continuar com próximo arquivo? (s/N): ")
                if response.lower() not in ['s', 'sim', 'y', 'yes']:
                    print("❌ Importação interrompida.")
                    break
        
        # Pausa entre arquivos (exceto no último)
        if i < len(sql_files):
            print("⏳ Aguardando 3 segundos...")
            time.sleep(3)
    
    print(f"\n📊 Resumo da Importação:")
    print(f"   • Arquivos processados: {success_count}/{len(sql_files)}")
    print(f"   • Taxa de sucesso: {(success_count/len(sql_files)*100):.1f}%")
    
    if success_count == len(sql_files):
        print("\n🎉 Importação concluída com sucesso!")
        print("\n📋 Verificações recomendadas:")
        print("   1. SELECT COUNT(*) FROM leads;")
        print("   2. SELECT * FROM leads LIMIT 5;")
        print("   3. Teste o dashboard da aplicação")
    else:
        print("\n⚠️  Importação parcial. Verifique os erros acima.")
        print("\n💡 Você pode tentar executar os arquivos manualmente:")
        for sql_file in sql_files:
            file_path = os.path.join(sql_batches_dir, sql_file)
            if os.path.exists(file_path):
                print(f"   psql '{connection_string}' -f '{file_path}'")

if __name__ == '__main__':
    main()