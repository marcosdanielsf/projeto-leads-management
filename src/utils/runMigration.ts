import { supabase } from '../lib/supabase'

export async function runMigration() {
  try {
    console.log('Executando migração da tabela leads...')
    
    // Criar tabela de leads
    const createTableSQL = `
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
    `
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    })
    
    if (createError) {
      console.error('Erro ao criar tabela:', createError)
      return false
    }
    
    console.log('Tabela leads criada com sucesso!')
    return true
  } catch (error) {
    console.error('Erro ao executar migração:', error)
    return false
  }
}

// Função disponível para execução manual
export { runMigration as default }