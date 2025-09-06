import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { migrateCSVData, clearLeadsTable } from '../utils/migrateCSVData'

const MigrationRunner: React.FC = () => {
  const [status, setStatus] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<string>('')
  const [isMigrating, setIsMigrating] = useState(false)

  const runMigration = async () => {
    setIsRunning(true)
    setStatus('Verificando se a tabela leads existe...')
    
    try {
      // Primeiro, verificar se a tabela existe
      const { error } = await supabase
        .from('leads')
        .select('*')
        .limit(1)
      
      if (error && error.code === '42P01') {
        setStatus('Tabela não existe. Criando tabela leads...')
        
        // Tentar inserir dados de teste para forçar a criação da estrutura
        const testLead = {
          usuario_responsavel: 'Sistema',
          contato_principal: 'Teste',
          etapa_funil: 'Lead',
          permissao_trabalho: 'Sim'
        }
        
        const { error: insertError } = await supabase
          .from('leads')
          .insert([testLead])
        
        if (insertError) {
          setStatus(`Erro ao criar tabela: ${insertError.message}. Por favor, execute o SQL manualmente no Supabase Dashboard.`)
        } else {
          setStatus('Tabela criada com sucesso! Removendo dados de teste...')
          
          // Remover o dado de teste
          await supabase
            .from('leads')
            .delete()
            .eq('usuario_responsavel', 'Sistema')
          
          setStatus('Migração concluída com sucesso!')
        }
      } else if (error) {
        setStatus(`Erro ao verificar tabela: ${error.message}`)
      } else {
        setStatus('Tabela leads já existe!')
      }
    } catch (error) {
      setStatus(`Erro na migração: ${error}`)
    }
    
    setIsRunning(false)
  }

  const sqlScript = `
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_responsavel TEXT NOT NULL,
  contato_principal TEXT NOT NULL,
  data_criada TIMESTAMP WITH TIME ZONE,
  fonte_lead TEXT,
  etapa_funil TEXT NOT NULL,
  estado_contato TEXT,
  tipo_agendamento TEXT,
  respostas_ia TEXT,
  email_comercial TEXT,
  telefone_comercial TEXT,
  estado_contato TEXT,
  permissao_trabalho TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_etapa_funil ON leads(etapa_funil);
CREATE INDEX IF NOT EXISTS idx_leads_estado_contato ON leads(estado_contato);
CREATE INDEX IF NOT EXISTS idx_leads_permissao_trabalho ON leads(permissao_trabalho);
CREATE INDEX IF NOT EXISTS idx_leads_usuario_responsavel ON leads(usuario_responsavel);
CREATE INDEX IF NOT EXISTS idx_leads_data_criada ON leads(data_criada);

-- Habilitar RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações para usuários autenticados
CREATE POLICY "Enable all operations for authenticated users" ON leads
  FOR ALL USING (auth.role() = 'authenticated');
`

  const runDataMigration = async () => {
    setIsMigrating(true)
    setMigrationStatus('Iniciando migração dos dados do CSV...')
    
    const result = await migrateCSVData()
    setMigrationStatus(result.message)
    setIsMigrating(false)
  }

  const clearData = async () => {
    if (!confirm('Tem certeza que deseja limpar todos os dados da tabela leads?')) {
      return
    }
    
    setIsMigrating(true)
    setMigrationStatus('Limpando dados da tabela...')
    
    const result = await clearLeadsTable()
    setMigrationStatus(result.message)
    setIsMigrating(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Migração do Banco de Dados</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">1. Criar Tabela</h3>
          <button
            onClick={runMigration}
            disabled={isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
          >
            {isRunning ? 'Executando...' : 'Criar Tabela Leads'}
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">2. Migrar Dados</h3>
          <button
            onClick={runDataMigration}
            disabled={isMigrating}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
          >
            {isMigrating ? 'Migrando...' : 'Migrar CSV para DB'}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <button
          onClick={clearData}
          disabled={isMigrating}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm"
        >
          Limpar Dados (Cuidado!)
        </button>
      </div>
      
      {status && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Status da Tabela:</h4>
          <p className="text-blue-700">{status}</p>
        </div>
      )}
      
      {migrationStatus && (
        <div className="mb-6 p-4 bg-green-100 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-1">Status da Migração:</h4>
          <p className="text-green-700">{migrationStatus}</p>
        </div>
      )}
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">SQL Manual (se necessário)</h3>
        <p className="text-sm text-gray-600 mb-3">
          Se a migração automática falhar, execute o SQL abaixo no Supabase Dashboard → SQL Editor:
        </p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
          {sqlScript}
        </pre>
      </div>
    </div>
  )
}

export default MigrationRunner