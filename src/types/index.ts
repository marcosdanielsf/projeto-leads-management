export interface LeadData {
  estado: string;
  totalLeads: number;
  permissaoTrabalho: string;
  etapaFunil: string;
  deEtapa: string;
  paraEtapa: string;
  taxaConversao: number;
}

export interface FunnelStage {
  stage: string;
  leads: number;
  conversionRate?: number;
}

export interface ConversionData {
  from: string;
  to: string;
  rate: number;
  leads: number;
}