import { supabase, Lead, LeadsByState, WorkPermitData, FunnelStageData } from '../lib/supabase'

export class LeadsService {
  // Buscar todos os leads
  static async getAllLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar leads:', error)
      throw error
    }

    return data || []
  }

  // Buscar leads por estado
  static async getLeadsByState(): Promise<LeadsByState[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('estado_contato')
      .not('estado_contato', 'is', null)

    if (error) {
      console.error('Erro ao buscar leads por estado:', error)
      throw error
    }

    // Agrupar e contar por estado
    const stateCount: { [key: string]: number } = {}
    data?.forEach(lead => {
      const estado = lead.estado_contato?.trim()
      if (estado) {
        stateCount[estado] = (stateCount[estado] || 0) + 1
      }
    })

    return Object.entries(stateCount).map(([estado, total_leads]) => ({
      estado,
      total_leads
    }))
  }

  // Buscar dados de permissão de trabalho
  static async getWorkPermitData(): Promise<WorkPermitData[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('permissao_trabalho')
      .not('permissao_trabalho', 'is', null)

    if (error) {
      console.error('Erro ao buscar dados de permissão de trabalho:', error)
      throw error
    }

    // Agrupar e contar por permissão de trabalho
    const permitCount: { [key: string]: number } = {}
    data?.forEach(lead => {
      const permissao = lead.permissao_trabalho?.trim()
      if (permissao) {
        permitCount[permissao] = (permitCount[permissao] || 0) + 1
      }
    })

    return Object.entries(permitCount).map(([permissao_trabalho, total_leads]) => ({
      permissao_trabalho,
      total_leads
    }))
  }

  // Buscar dados do funil de vendas
  static async getFunnelStageData(): Promise<FunnelStageData[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('etapa_funil')
      .not('etapa_funil', 'is', null)

    if (error) {
      console.error('Erro ao buscar dados do funil:', error)
      throw error
    }

    // Agrupar e contar por etapa do funil
    const stageCount: { [key: string]: number } = {}
    data?.forEach(lead => {
      const etapa = lead.etapa_funil?.trim()
      if (etapa) {
        stageCount[etapa] = (stageCount[etapa] || 0) + 1
      }
    })

    return Object.entries(stageCount).map(([etapa_funil, total_leads]) => ({
      etapa_funil,
      total_leads
    }))
  }

  // Buscar evolução mensal dos leads
  static async getMonthlyEvolution(): Promise<{ month: string; leads: number; conversions: number }[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('data_criada, etapa_funil')
      .not('data_criada', 'is', null)
      .order('data_criada', { ascending: true })

    if (error) {
      console.error('Erro ao buscar evolução mensal:', error)
      throw error
    }

    // Agrupar por mês
    const monthlyData: { [key: string]: { leads: number; conversions: number } } = {}
    
    data?.forEach(lead => {
      if (lead.data_criada) {
        const date = new Date(lead.data_criada)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { leads: 0, conversions: 0 }
        }
        
        monthlyData[monthKey].leads++
        
        // Considerar conversão se chegou ao meeting realizado
        if (lead.etapa_funil?.includes('meeting realizado')) {
          monthlyData[monthKey].conversions++
        }
      }
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        leads: data.leads,
        conversions: data.conversions
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  // Inserir novo lead
  static async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar lead:', error)
      throw error
    }

    return data
  }

  // Atualizar lead
  static async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar lead:', error)
      throw error
    }

    return data
  }

  // Deletar lead
  static async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar lead:', error)
      throw error
    }
  }

  // Buscar estatísticas gerais
  static async getGeneralStats(): Promise<{
    totalLeads: number
    meetingsRealized: number
    conversionRate: number
  }> {
    const { data, error } = await supabase
      .from('leads')
      .select('etapa_funil')

    if (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }

    const totalLeads = data?.length || 0
    const meetingsRealized = data?.filter(lead => 
      lead.etapa_funil?.includes('meeting realizado')
    ).length || 0
    
    const conversionRate = totalLeads > 0 ? (meetingsRealized / totalLeads) * 100 : 0

    return {
      totalLeads,
      meetingsRealized,
      conversionRate
    }
  }
}