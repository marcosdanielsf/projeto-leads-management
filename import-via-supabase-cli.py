#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para importar dados via Supabase CLI
Usa os arquivos SQL divididos e executa via CLI
"""

import os
import subprocess
import time

def run_supabase_sql(sql_file):
    """Executa um arquivo SQL via Supabase CLI"""
    try:
        print(f"📄 Executando: {os.path.basename(sql_file)}")
        
        # Executar via supabase db reset com arquivo SQL
        result = subprocess.run([
            'supabase', 'db', 'reset', '--db-url', 
            'postgresql://postgres:[YOUR-PASSWORD]@db.bfumywvwubvernvhjehk.supabase.co:5432/postgres'
        ], capture_output=True, text=True, cwd='/Users/marcosdaniels/Downloads/project')
        
        if result.returncode == 0:
            print(f"✅ {os.path.basename(sql_file)} executado com sucesso")
            return True
        else:
            print(f"❌ Erro ao executar {os.path.basename(sql_file)}: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def execute_sql_file_direct(sql_file):
    """Executa arquivo SQL diretamente via psql"""
    try:
        print(f"📄 Executando: {os.path.basename(sql_file)}")
        
        # Ler conteúdo do arquivo
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Executar via supabase CLI
        process = subprocess.Popen([
            'supabase', 'db', 'reset'
        ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
           text=True, cwd='/Users/marcosdaniels/Downloads/project')
        
        stdout, stderr = process.communicate(input=sql_content)
        
        if process.returncode == 0:
            print(f"✅ {os.path.basename(sql_file)} executado com sucesso")
            if stdout:
                print(f"📋 Output: {stdout[:200]}...")
            return True
        else:
            print(f"❌ Erro ao executar {os.path.basename(sql_file)}")
            if stderr:
                print(f"🔍 Erro: {stderr[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
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
    
    print("🚀 Iniciando importação via Supabase CLI...")
    print(f"📁 Diretório: {sql_batches_dir}")
    
    success_count = 0
    
    for sql_file in sql_files:
        file_path = os.path.join(sql_batches_dir, sql_file)
        
        if not os.path.exists(file_path):
            print(f"⚠️  Arquivo não encontrado: {sql_file}")
            continue
        
        print(f"\n📦 Processando: {sql_file}")
        
        # Tentar executar o arquivo
        success = execute_sql_file_direct(file_path)
        
        if success:
            success_count += 1
        else:
            print(f"❌ Falha ao executar {sql_file}")
            # Continuar mesmo com erro
        
        # Pausa entre arquivos
        time.sleep(2)
    
    print(f"\n📊 Resumo:")
    print(f"   • Arquivos processados: {len(sql_files)}")
    print(f"   • Sucessos: {success_count}")
    print(f"   • Taxa de sucesso: {(success_count/len(sql_files)*100):.1f}%")
    
    if success_count == len(sql_files):
        print("\n🎉 Importação concluída com sucesso!")
    else:
        print("\n⚠️  Importação parcial. Verifique os erros acima.")
    
    print("\n💡 Próximos passos:")
    print("   1. Verifique os dados no Supabase Dashboard")
    print("   2. Execute: SELECT COUNT(*) FROM leads;")
    print("   3. Teste o dashboard da aplicação")

if __name__ == '__main__':
    main()