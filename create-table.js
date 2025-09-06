// Script para executar no console do navegador
// Abra o navegador em http://localhost:5173 e execute este código no console

import { supabase } from './src/lib/supabase.js'

async function createLeadsTable() {
  try {
    console.log('Criando tabela leads...')
    
    // Primeiro, vamos tentar criar a tabela usando uma query simples
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (error && error.code === '42P01') {
      console.log('Tabela não existe, tentando criar...')
      
      // Se a tabela não existe, vamos usar o SQL Editor do Supabase
      console.log('Por favor, execute o seguinte SQL no SQL Editor do Supabase Dashboard:')
      console.log(`
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_responsavel TEXT NOT NULL,
  contato_principal TEXT NOT NULL,
  data_criada TIMESTAMP WITH TIME ZONE,
  fonte_lead TEXT,
  etapa_funil TEXT NOT NULL,
  estado_mora TEXT,
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
CREATE INDEX IF NOT EXISTS idx_leads_estado_mora ON leads(estado_mora);
CREATE INDEX IF NOT EXISTS idx_leads_permissao_trabalho ON leads(permissao_trabalho);
CREATE INDEX IF NOT EXISTS idx_leads_usuario_responsavel ON leads(usuario_responsavel);
CREATE INDEX IF NOT EXISTS idx_leads_data_criada ON leads(data_criada);

-- Habilitar RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações para usuários autenticados
CREATE POLICY "Enable all operations for authenticated users" ON leads
  FOR ALL USING (auth.role() = 'authenticated');
`)
      
      console.log('\nDepois de executar o SQL acima, recarregue a página.')
    } else if (error) {
      console.error('Erro ao verificar tabela:', error)
    } else {
      console.log('Tabela leads já existe!')
    }
  } catch (error) {
    console.error('Erro:', error)
  }
}

// Executar automaticamente
createLeadsTable()