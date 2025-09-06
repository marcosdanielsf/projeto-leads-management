import { supabase } from '../lib/supabase'
import Papa from 'papaparse'

interface CSVLead {
  'Usuário Responsável': string
  'Contato principal': string
  'Data Criada': string
  'Fonte do Lead': string
  'Etapa do Funil de Vendas': string
  'estado onde mora': string
  'Tipo do agendamento': string
  'Respostas Gerais da I.A': string
  'Email comercial (contato)': string
  'Telefone comercial (contato)': string
  'Estado onde mora (contato)': string
  'Permissão de trabalho': string
}

function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null
  
  try {
    // Formato: "20.08.2025 11:42:46"
    const [datePart, timePart] = dateStr.split(' ')
    const [day, month, year] = datePart.split('.')
    const [hour, minute, second] = timePart.split(':')
    
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Mês é 0-indexado
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    )
    
    return date.toISOString()
  } catch (error) {
    console.warn('Erro ao parsear data:', dateStr, error)
    return null
  }
}

function mapCSVToLead(csvRow: CSVLead) {
  return {
    usuario_responsavel: csvRow['Usuário Responsável'] || '',
    contato_principal: csvRow['Contato principal'] || '',
    data_criada: parseDate(csvRow['Data Criada']),
    fonte_lead: csvRow['Fonte do Lead'] || null,
    etapa_funil: csvRow['Etapa do Funil de Vendas'] || '',
    tipo_agendamento: csvRow['Tipo do agendamento'] || null,
    respostas_ia: csvRow['Respostas Gerais da I.A'] || null,
    email_comercial: csvRow['Email comercial (contato)'] || null,
    telefone_comercial: csvRow['Telefone comercial (contato)'] || null,
    estado_contato: csvRow['estado onde mora'] || csvRow['Estado onde mora (contato)'] || null,
    permissao_trabalho: csvRow['Permissão de trabalho'] || ''
  }
}

export async function migrateCSVData(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    console.log('Iniciando migração dos dados do CSV...')
    
    // Buscar o arquivo CSV
    const response = await fetch('/data/dados lead gustavo - leads.csv')
    if (!response.ok) {
      throw new Error('Erro ao carregar arquivo CSV')
    }
    
    const csvText = await response.text()
    
    // Parsear o CSV
    const parseResult = Papa.parse<CSVLead>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim()
    })
    
    if (parseResult.errors.length > 0) {
      console.warn('Erros no parsing do CSV:', parseResult.errors)
    }
    
    const csvData = parseResult.data
    console.log(`Encontrados ${csvData.length} registros no CSV`)
    
    // Verificar se já existem dados na tabela
    const { count: existingCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
    
    if (existingCount && existingCount > 0) {
      return {
        success: false,
        message: `Tabela já contém ${existingCount} registros. Migração cancelada para evitar duplicatas.`
      }
    }
    
    // Mapear e filtrar dados válidos
    const leadsToInsert = csvData
      .map(mapCSVToLead)
      .filter((lead: ReturnType<typeof mapCSVToLead>) => 
        lead.usuario_responsavel && 
        lead.contato_principal && 
        lead.etapa_funil && 
        lead.permissao_trabalho
      )
    
    console.log(`Preparando ${leadsToInsert.length} registros válidos para inserção`)
    
    if (leadsToInsert.length === 0) {
      return {
        success: false,
        message: 'Nenhum registro válido encontrado no CSV'
      }
    }
    
    // Inserir dados em lotes de 100
    const batchSize = 100
    let totalInserted = 0
    
    for (let i = 0; i < leadsToInsert.length; i += batchSize) {
      const batch = leadsToInsert.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('leads')
        .insert(batch)
      
      if (error) {
        console.error('Erro ao inserir lote:', error)
        throw error
      }
      
      totalInserted += batch.length
      console.log(`Inseridos ${totalInserted}/${leadsToInsert.length} registros`)
    }
    
    return {
      success: true,
      message: `Migração concluída com sucesso! ${totalInserted} registros inseridos.`,
      count: totalInserted
    }
    
  } catch (error) {
    console.error('Erro na migração:', error)
    return {
      success: false,
      message: `Erro na migração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    }
  }
}

// Função para limpar dados da tabela (usar com cuidado)
export async function clearLeadsTable(): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Deletar todos os registros
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      message: 'Tabela limpa com sucesso!'
    }
  } catch (error) {
    return {
      success: false,
      message: `Erro ao limpar tabela: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    }
  }
}