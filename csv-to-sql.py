#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import os
from datetime import datetime

def convert_date(date_str):
    """Converte data do formato DD/MM/YYYY para YYYY-MM-DD"""
    if not date_str or date_str.strip() == '':
        return 'NULL'
    
    try:
        # Formato esperado: DD/MM/YYYY
        day, month, year = date_str.split('/')
        return f"'{year}-{month.zfill(2)}-{day.zfill(2)}'"
    except:
        return 'NULL'

def escape_sql_string(value):
    """Escapa strings para SQL"""
    if value is None or value == '':
        return 'NULL'
    
    # Escapar aspas simples
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"

def process_csv_to_sql():
    """Processa o CSV e gera comandos SQL INSERT"""
    
    # Caminhos dos arquivos
    csv_path = 'public/leads_filtrado_revisado.csv'
    sql_path = 'insert-leads-data.sql'
    
    if not os.path.exists(csv_path):
        print(f"❌ Arquivo não encontrado: {csv_path}")
        return
    
    print(f"📁 Lendo arquivo: {csv_path}")
    
    # Abrir arquivo SQL para escrita
    with open(sql_path, 'w', encoding='utf-8') as sql_file:
        # Cabeçalho do arquivo SQL
        sql_file.write("-- Comandos SQL para inserção de dados dos leads\n")
        sql_file.write("-- Gerado automaticamente a partir do CSV\n\n")
        
        sql_file.write("-- Desabilitar RLS temporariamente\n")
        sql_file.write("ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;\n\n")
        
        # Ler CSV
        with open(csv_path, 'r', encoding='utf-8') as csv_file:
            reader = csv.DictReader(csv_file)
            
            batch_size = 100
            batch_count = 0
            records_in_batch = 0
            total_records = 0
            
            values_list = []
            
            for row in reader:
                total_records += 1
                
                # Mapear campos do CSV
                lead_id = escape_sql_string(row.get('lead_id', ''))
                usuario_responsavel = escape_sql_string(row.get('usuario_responsavel', ''))
                contato_principal = escape_sql_string(row.get('contato_principal (obrigatório)', ''))
                data_criada = convert_date(row.get('data_criada', ''))
                fonte_lead = escape_sql_string(row.get('fonte_lead', ''))
                etapa_funil = escape_sql_string(row.get('etapa_funil (obrigatório)', ''))
                estado_onde_mora = escape_sql_string(row.get('estado onde mora', ''))
                tipo_agendamento = escape_sql_string(row.get('tipo_agendamento', ''))
                respostas_ia = escape_sql_string(row.get('respostas_ia', ''))
                email_comercial = escape_sql_string(row.get('email_comercial', ''))
                telefone_comercial = escape_sql_string(row.get('telefone_comercial', ''))
                estado_contato = escape_sql_string(row.get('estado_contato', ''))
                permissao_trabalho = escape_sql_string(row.get('permissao_trabalho (obrigatório)', ''))
                data_entrada_agendamento = convert_date(row.get('data_entrada_agendamento', ''))
                data_hora_agendamento_bposs = escape_sql_string(row.get('data_hora_agendamento_bposs', ''))
                
                # Criar linha de valores
                values = f"""(
    {lead_id},
    {usuario_responsavel},
    {contato_principal},
    {data_criada},
    {fonte_lead},
    {etapa_funil},
    {estado_onde_mora},
    {tipo_agendamento},
    {respostas_ia},
    {email_comercial},
    {telefone_comercial},
    {estado_contato},
    {permissao_trabalho},
    {data_entrada_agendamento},
    {data_hora_agendamento_bposs}
)"""
                
                values_list.append(values)
                records_in_batch += 1
                
                # Quando atingir o tamanho do lote, escrever INSERT
                if records_in_batch >= batch_size:
                    batch_count += 1
                    
                    sql_file.write(f"-- Lote {batch_count} ({records_in_batch} registros)\n")
                    sql_file.write("INSERT INTO public.leads (\n")
                    sql_file.write("    lead_id,\n")
                    sql_file.write("    usuario_responsavel,\n")
                    sql_file.write("    contato_principal,\n")
                    sql_file.write("    data_criada,\n")
                    sql_file.write("    fonte_lead,\n")
                    sql_file.write("    etapa_funil,\n")
                    sql_file.write("    estado_onde_mora,\n")
                    sql_file.write("    tipo_agendamento,\n")
                    sql_file.write("    respostas_ia,\n")
                    sql_file.write("    email_comercial,\n")
                    sql_file.write("    telefone_comercial,\n")
                    sql_file.write("    estado_contato,\n")
                    sql_file.write("    permissao_trabalho,\n")
                    sql_file.write("    data_entrada_agendamento,\n")
                    sql_file.write("    data_hora_agendamento_bposs\n")
                    sql_file.write(") VALUES\n")
                    sql_file.write(',\n'.join(values_list))
                    sql_file.write(";\n\n")
                    
                    # Resetar para próximo lote
                    values_list = []
                    records_in_batch = 0
            
            # Processar último lote se houver registros restantes
            if records_in_batch > 0:
                batch_count += 1
                
                sql_file.write(f"-- Lote {batch_count} ({records_in_batch} registros)\n")
                sql_file.write("INSERT INTO public.leads (\n")
                sql_file.write("    lead_id,\n")
                sql_file.write("    usuario_responsavel,\n")
                sql_file.write("    contato_principal,\n")
                sql_file.write("    data_criada,\n")
                sql_file.write("    fonte_lead,\n")
                sql_file.write("    etapa_funil,\n")
                sql_file.write("    estado_onde_mora,\n")
                sql_file.write("    tipo_agendamento,\n")
                sql_file.write("    respostas_ia,\n")
                sql_file.write("    email_comercial,\n")
                sql_file.write("    telefone_comercial,\n")
                sql_file.write("    estado_contato,\n")
                sql_file.write("    permissao_trabalho,\n")
                sql_file.write("    data_entrada_agendamento,\n")
                sql_file.write("    data_hora_agendamento_bposs\n")
                sql_file.write(") VALUES\n")
                sql_file.write(',\n'.join(values_list))
                sql_file.write(";\n\n")
        
        # Rodapé do arquivo SQL
        sql_file.write("-- Reabilitar RLS\n")
        sql_file.write("ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;\n\n")
        
        sql_file.write("-- Verificar dados inseridos\n")
        sql_file.write("SELECT COUNT(*) as total_registros FROM public.leads;\n")
        sql_file.write("SELECT * FROM public.leads LIMIT 10;\n")
    
    print(f"✅ Arquivo SQL gerado: {sql_path}")
    print(f"📊 Total de registros processados: {total_records}")
    print(f"📦 Total de lotes: {batch_count}")
    print("\n🚀 Próximos passos:")
    print("1. Abra o Supabase Dashboard")
    print("2. Vá para SQL Editor")
    print("3. Execute primeiro o arquivo 'final-import.sql' para criar a tabela")
    print("4. Execute depois o arquivo 'insert-leads-data.sql' para inserir os dados")
    print("5. Verifique os resultados")

if __name__ == "__main__":
    process_csv_to_sql()