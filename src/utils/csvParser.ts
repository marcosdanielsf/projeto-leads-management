import { FunnelStage, ConversionData } from '../types';
import { LeadsService } from '../services/leadsService';
import { useState, useEffect } from 'react';

// Hook para buscar dados do Supabase
export const useSupabaseData = () => {
  const [data, setData] = useState<{
    leadsByState: Array<{ state: string; leads: number }>;
    workPermitData: Array<{ category: string; leads: number }>;
    funnelStages: Array<{ stage: string; leads: number }>;
    monthlyEvolution: Array<{ month: string; leads: number; conversions: number }>;
    conversionRates: Array<{ from: string; to: string; rate: number; leads: number }>;
    totalLeads: number;
    loading: boolean;
    error: string | null;
  }>({
    leadsByState: [],
    workPermitData: [],
    funnelStages: [],
    monthlyEvolution: [],
    conversionRates: [],
    totalLeads: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsByState, workPermitData, funnelStages, monthlyEvolution, stats] = await Promise.all([
          LeadsService.getLeadsByState(),
          LeadsService.getWorkPermitData(),
          LeadsService.getFunnelStageData(),
          LeadsService.getMonthlyEvolution(),
          LeadsService.getGeneralStats()
        ]);

        // Mapear dados para o formato esperado pelos componentes
        const mappedLeadsByState = leadsByState.map(item => ({
          state: item.estado,
          leads: item.total_leads
        }));

        const mappedWorkPermitData = workPermitData.map(item => ({
          category: item.permissao_trabalho === 'Sim' ? 'Com Permissão' : 'Sem Permissão',
          leads: item.total_leads
        }));

        const mappedFunnelStages = funnelStages.map(item => ({
          stage: item.etapa_funil,
          leads: item.total_leads
        }));

        const mappedMonthlyEvolution = monthlyEvolution.map(item => ({
          month: new Date(item.month + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
          leads: item.leads,
          conversions: item.conversions
        }));

        // Calcular taxas de conversão entre etapas
         const conversionRates = [];
         for (let i = 0; i < mappedFunnelStages.length - 1; i++) {
           const current = mappedFunnelStages[i];
           const next = mappedFunnelStages[i + 1];
           const rate = current.leads > 0 ? Math.round((next.leads / current.leads) * 100) : 0;
           conversionRates.push({
             from: current.stage,
             to: next.stage,
             rate,
             leads: next.leads
           });
         }

        setData({
          leadsByState: mappedLeadsByState,
          workPermitData: mappedWorkPermitData,
          funnelStages: mappedFunnelStages,
          monthlyEvolution: mappedMonthlyEvolution,
          conversionRates,
          totalLeads: stats.totalLeads,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Erro ao carregar dados do banco'
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};

// Função de fallback com dados simulados (para compatibilidade)
export const parseCSVData = (): {
  leadsByState: Array<{ state: string; leads: number }>;
  workPermitData: Array<{ category: string; leads: number }>;
  funnelStages: FunnelStage[];
  conversionRates: ConversionData[];
  totalLeads: number;
  monthlyEvolution: Array<{ month: string; leads: number; conversions: number; rate: number }>;
} => {
  // Dados dos estados baseados no CSV real
  const stateData = [
    { state: 'Florida', leads: 29 },
    { state: 'Massachusetts', leads: 17 },
    { state: 'California', leads: 13 },
    { state: 'Flórida', leads: 11 },
    { state: 'Texas', leads: 9 },
    { state: 'FL', leads: 5 },
    { state: 'Utah', leads: 4 },
    { state: 'New Jersey', leads: 4 },
    { state: 'MA', leads: 3 },
    { state: 'Georgia', leads: 3 },
    { state: 'New York', leads: 3 },
    { state: 'Illinois', leads: 3 },
    { state: 'Colorado', leads: 2 },
    { state: 'Connecticut', leads: 2 },
    { state: 'GA', leads: 2 },
    { state: 'Washington', leads: 2 },
    { state: 'WA', leads: 1 },
    { state: 'Maryland', leads: 1 },
    { state: 'Maine', leads: 1 },
  ];

  // Dados de permissão de trabalho
  const workPermitData = [
    { category: 'Possui Work Permit', leads: 105 },
    { category: 'Não possui Work Permit', leads: 14 },
  ];

  // Etapas do funil com dados reais
  const funnelStages = [
    { stage: 'Ativação', leads: 84 },
    { stage: 'Qualificação', leads: 17 },
    { stage: 'Sondagem', leads: 13 },
    { stage: 'Dados p/ Agendamento', leads: 48 },
    { stage: 'Agendamento', leads: 6 },
    { stage: 'Reagendamento', leads: 26 },
    { stage: 'Meeting Realizado', leads: 23 },
  ];

  // Taxas de conversão reais do CSV
  const conversionRates = [
    { from: 'Lead Qualificado', to: 'Agendamento', rate: 75, leads: 147 },
    { from: 'Agendamento', to: 'Meeting Realizado', rate: 61, leads: 89 },
    { from: 'Meeting Realizado', to: 'Proposta Enviada', rate: 63, leads: 56 },
    { from: 'Proposta Enviada', to: 'Fechamento', rate: 61, leads: 34 }
  ];

  // Evolução mensal simulada baseada nos dados
  const monthlyEvolution = [
    { month: 'Jan', leads: 45, conversions: 8, rate: 17.8 },
    { month: 'Fev', leads: 52, conversions: 12, rate: 23.1 },
    { month: 'Mar', leads: 48, conversions: 10, rate: 20.8 },
    { month: 'Abr', leads: 61, conversions: 15, rate: 24.6 },
    { month: 'Mai', leads: 58, conversions: 14, rate: 24.1 },
    { month: 'Jun', leads: 67, conversions: 18, rate: 26.9 },
    { month: 'Jul', leads: 72, conversions: 20, rate: 27.8 },
    { month: 'Ago', leads: 89, conversions: 25, rate: 28.1 },
  ];

  const totalLeads = 217; // Total de leads no sistema

  return {
    leadsByState: stateData,
    workPermitData,
    funnelStages,
    conversionRates,
    totalLeads,
    monthlyEvolution,
  };
};