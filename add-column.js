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

async function addDataEntradaAgendamentoColumn() {
  try {
    console.log('Adicionando coluna data_entrada_agendamento...')
    
    // SQL para adicionar a nova coluna
    const sql = `
      -- Adicionar coluna para data que o lead entrou na etapa de agendamento
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS data_entrada_agendamento TIMESTAMP WITH TIME ZONE;
      
      -- Criar índice para melhor performance na nova coluna
      CREATE INDEX IF NOT EXISTS idx_leads_data_entrada_agendamento ON leads(data_entrada_agendamento);
    `
    
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('Erro ao executar SQL:', error)
      
      // Tentar método alternativo usando uma query simples
      console.log('Tentando método alternativo...')
      
      const { error: altError } = await supabase
        .from('leads')
        .select('data_entrada_agendamento')
        .limit(1)
      
      if (altError && altError.code === '42703') {
        console.log('\nA coluna ainda não existe. Execute o seguinte SQL manualmente no Supabase Dashboard:')
        console.log('\n--- SQL para executar ---')
        console.log(sql)
        console.log('--- Fim do SQL ---\n')
      } else if (altError) {
        console.error('Erro alternativo:', altError)
      } else {
        console.log('✅ Coluna data_entrada_agendamento já existe!')
      }
    } else {
      console.log('✅ Coluna data_entrada_agendamento adicionada com sucesso!')
    }
    
  } catch (error) {
    console.error('Erro:', error)
  }
}

// Executar
addDataEntradaAgendamentoColumn()