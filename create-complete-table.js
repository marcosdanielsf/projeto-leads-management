import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Ler variáveis de ambiente do arquivo .env
const envContent = readFileSync('.env', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createCompleteLeadsTable() {
  try {
    console.log('Verificando se a tabela leads existe...')
    
    // Tentar acessar a tabela para ver se existe
    const { error: checkError } = await supabase
      .from('leads')
      .select('id')
      .limit(1)
    
    if (checkError && checkError.code === '42P01') {
      console.log('Tabela não existe. Criando tabela completa com todas as colunas...')
      console.log('\n=== EXECUTE O SEGUINTE SQL NO SUPABASE DASHBOARD ===')
      console.log('\n1. Acesse: https://supabase.com/dashboard')
      console.log('2. Vá para seu projeto')
      console.log('3. Clique em "SQL Editor" no menu lateral')
      console.log('4. Cole e execute o SQL abaixo:')
      console.log('\n--- INÍCIO DO SQL ---')
      
      const sql = `-- Criar tabela de leads completa
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id TEXT,
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
  data_entrada_agendamento TIMESTAMP WITH TIME ZONE,
  data_hora_agendamento_bposs TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_lead_id_unique ON leads(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_etapa_funil ON leads(etapa_funil);
CREATE INDEX IF NOT EXISTS idx_leads_estado_mora ON leads(estado_mora);
CREATE INDEX IF NOT EXISTS idx_leads_permissao_trabalho ON leads(permissao_trabalho);
CREATE INDEX IF NOT EXISTS idx_leads_usuario_responsavel ON leads(usuario_responsavel);
CREATE INDEX IF NOT EXISTS idx_leads_data_criada ON leads(data_criada);
CREATE INDEX IF NOT EXISTS idx_leads_data_entrada_agendamento ON leads(data_entrada_agendamento);
CREATE INDEX IF NOT EXISTS idx_leads_data_hora_agendamento_bposs ON leads(data_hora_agendamento_bposs);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura para usuários autenticados
CREATE POLICY "Allow read access for authenticated users" ON leads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Criar política para permitir inserção para usuários autenticados
CREATE POLICY "Allow insert for authenticated users" ON leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Criar política para permitir atualização para usuários autenticados
CREATE POLICY "Allow update for authenticated users" ON leads
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Criar política para permitir exclusão para usuários autenticados
CREATE POLICY "Allow delete for authenticated users" ON leads
    FOR DELETE USING (auth.role() = 'authenticated');`
      
      console.log(sql)
      console.log('\n--- FIM DO SQL ---\n')
      console.log('5. Após executar o SQL, execute este script novamente para verificar.')
      
    } else if (checkError) {
      console.error('Erro ao verificar tabela:', checkError)
    } else {
      console.log('✅ Tabela leads já existe!')
      
      // Verificar se a nova coluna existe
      const { error: columnError } = await supabase
        .from('leads')
        .select('data_entrada_agendamento')
        .limit(1)
      
      if (columnError && columnError.code === '42703') {
        console.log('\n⚠️  A coluna data_entrada_agendamento não existe ainda.')
        console.log('Execute o seguinte SQL para adicionar a coluna:')
        console.log('\n--- SQL PARA ADICIONAR COLUNA ---')
        console.log('ALTER TABLE leads ADD COLUMN IF NOT EXISTS data_entrada_agendamento TIMESTAMP WITH TIME ZONE;')
        console.log('CREATE INDEX IF NOT EXISTS idx_leads_data_entrada_agendamento ON leads(data_entrada_agendamento);')
        console.log('--- FIM DO SQL ---\n')
      } else if (columnError) {
        console.error('Erro ao verificar coluna:', columnError)
      } else {
        console.log('✅ Coluna data_entrada_agendamento já existe!')
        console.log('\n🎉 Tabela está completa e pronta para receber dados!')
        console.log('\nColunas disponíveis:')
        console.log('- lead_id (para validação e prevenção de duplicatas)')
        console.log('- usuario_responsavel')
        console.log('- contato_principal')
        console.log('- data_criada')
        console.log('- fonte_lead')
        console.log('- etapa_funil')
        console.log('- estado_mora')
        console.log('- tipo_agendamento')
        console.log('- respostas_ia')
        console.log('- email_comercial')
        console.log('- telefone_comercial')
        console.log('- estado_contato')
        console.log('- permissao_trabalho')
         console.log('- data_entrada_agendamento (data que foi agendado)')
         console.log('- data_hora_agendamento_bposs (horário que vai acontecer a reunião)')
         console.log('\n⚠️  IMPORTANTE: A coluna lead_id deve ter valores únicos para evitar duplicatas!')
      }
    }
    
  } catch (error) {
    console.error('Erro:', error)
  }
}

// Executar
createCompleteLeadsTable()