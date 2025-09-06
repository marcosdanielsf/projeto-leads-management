import { supabase } from '../lib/supabase'
import { Lead } from '../lib/supabase'

// Dados de exemplo para popular o banco
const sampleLeads: Omit<Lead, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    usuario_responsavel: 'João Silva',
    contato_principal: 'Maria Santos',
    data_criada: '2024-01-15T10:30:00Z',
    fonte_lead: 'Website',
    etapa_funil: 'lead qualificado',
    tipo_agendamento: 'Consulta inicial',
    respostas_ia: 'Interessado em imigração',
    email_comercial: 'maria.santos@email.com',
    telefone_comercial: '+55 11 99999-1111',
    estado_contato: 'SP',
    permissao_trabalho: 'Não'
  },
  {
    usuario_responsavel: 'Ana Costa',
    contato_principal: 'Pedro Oliveira',
    data_criada: '2024-01-20T14:15:00Z',
    fonte_lead: 'Facebook',
    etapa_funil: 'meeting realizado',
    tipo_agendamento: 'Avaliação de perfil',
    respostas_ia: 'Quer trabalhar no Canadá',
    email_comercial: 'pedro.oliveira@email.com',
    telefone_comercial: '+55 21 88888-2222',
    estado_contato: 'RJ',
    permissao_trabalho: 'Sim'
  },
  {
    usuario_responsavel: 'Carlos Mendes',
    contato_principal: 'Ana Ferreira',
    data_criada: '2024-02-01T09:45:00Z',
    fonte_lead: 'Google Ads',
    etapa_funil: 'lead qualificado',
    tipo_agendamento: 'Primeira consulta',
    respostas_ia: 'Família interessada',
    email_comercial: 'ana.ferreira@email.com',
    telefone_comercial: '+55 31 77777-3333',
    estado_contato: 'MG',
    permissao_trabalho: 'Não'
  },
  {
    usuario_responsavel: 'Lucia Rodrigues',
    contato_principal: 'Roberto Silva',
    data_criada: '2024-02-10T16:20:00Z',
    fonte_lead: 'Instagram',
    etapa_funil: 'meeting realizado',
    tipo_agendamento: 'Consulta especializada',
    respostas_ia: 'Profissional de TI',
    email_comercial: 'roberto.silva@email.com',
    telefone_comercial: '+55 51 66666-4444',
    estado_contato: 'RS',
    permissao_trabalho: 'Sim'
  },
  {
    usuario_responsavel: 'Fernando Lima',
    contato_principal: 'Carla Souza',
    data_criada: '2024-02-15T11:10:00Z',
    fonte_lead: 'Indicação',
    etapa_funil: 'lead não qualificado',
    tipo_agendamento: 'Consulta básica',
    respostas_ia: 'Apenas curiosidade',
    email_comercial: 'carla.souza@email.com',
    telefone_comercial: '+55 41 55555-5555',
    estado_contato: 'PR',
    permissao_trabalho: 'Não'
  }
]

export async function seedDatabase(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    console.log('Iniciando seed do banco de dados...')
    
    // Verificar se já existem dados
    const { data: existingData, error: checkError } = await supabase
      .from('leads')
      .select('id')
      .limit(1)
    
    if (checkError) {
      throw checkError
    }
    
    if (existingData && existingData.length > 0) {
      return {
        success: false,
        message: 'Banco já possui dados. Use clearLeadsTable() primeiro se quiser recriar os dados.'
      }
    }
    
    // Inserir dados de exemplo
    const { data, error } = await supabase
      .from('leads')
      .insert(sampleLeads)
      .select()
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      message: `Seed realizado com sucesso! ${data?.length || 0} leads inseridos.`,
      count: data?.length || 0
    }
  } catch (error) {
    return {
      success: false,
      message: `Erro ao fazer seed: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    }
  }
}

// Função para limpar e recriar dados
export async function clearAndSeedDatabase(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    console.log('Limpando e recriando dados...')
    
    // Limpar dados existentes
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Deletar todos
    
    if (deleteError) {
      throw deleteError
    }
    
    // Inserir novos dados
    const { data, error } = await supabase
      .from('leads')
      .insert(sampleLeads)
      .select()
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      message: `Dados recriados com sucesso! ${data?.length || 0} leads inseridos.`,
      count: data?.length || 0
    }
  } catch (error) {
    return {
      success: false,
      message: `Erro ao recriar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    }
  }
}

// Executar se chamado diretamente no console
if (typeof window !== 'undefined') {
  // Funções disponíveis globalmente para debug
  Object.assign(window, { seedDatabase, clearAndSeedDatabase });
}