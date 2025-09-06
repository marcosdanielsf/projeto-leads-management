import React from 'react';
import { Users, Target, Award, MapPin, Briefcase } from 'lucide-react';
import MetricCard from '../MetricCard';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import FunnelChart from '../charts/FunnelChart';
import GeographicChart from '../charts/GeographicChart';
import { DatabaseManager } from '../DatabaseManager';
import { useSupabaseData, parseCSVData } from '../../utils/csvParser';

const HomePage: React.FC = () => {
  const supabaseData = useSupabaseData();
  
  // Usar dados do Supabase se disponíveis, senão usar dados simulados
  const data = supabaseData.loading || supabaseData.error ? parseCSVData() : supabaseData;
  const { leadsByState, workPermitData, funnelStages, totalLeads, conversionRates } = data;

  const workPermitChartData = workPermitData.map((item, index) => ({
    label: item.category,
    value: item.leads,
    color: index === 0 ? '#10B981' : '#EF4444',
  }));

  // Métricas calculadas dos dados reais
  const totalRespondedState = leadsByState.reduce((sum, item) => sum + item.leads, 0);
  const totalWorkPermit = workPermitData.reduce((sum, item) => sum + item.leads, 0);
  const meetingsRealized = funnelStages.find(stage => stage.stage === 'Meeting Realizado')?.leads || 0;
  const conversionRate = totalLeads > 0 ? ((meetingsRealized / totalLeads) * 100).toFixed(1) : '0';
  const scheduledLeads = funnelStages.find(stage => stage.stage === 'Agendamento')?.leads || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Vendas</h1>
          <p className="text-gray-600 mt-1">Visão geral dos leads e performance de vendas</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Última atualização</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Gerenciamento do Banco */}
      <DatabaseManager />

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Leads"
          value={totalLeads}
          change="+12.5%"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Com Work Permit"
          value={workPermitData[0]?.leads || 0}
          change="+8.2%"
          changeType="positive"
          icon={Briefcase}
          color="green"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${conversionRate}%`}
          change="+2.1%"
          changeType="positive"
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Leads Agendados"
          value={scheduledLeads}
          change="+15.3%"
          changeType="positive"
          icon={Award}
          color="orange"
        />
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={leadsByState.slice(0, 10).map(item => ({
            label: item.state,
            value: item.leads,
          }))}
          title={`Leads por Estado (Top 10 de ${totalRespondedState} que responderam)`}
          height={400}
        />
        <PieChart
          data={workPermitChartData}
          title={`Work Permit (${totalWorkPermit} de ${totalLeads} responderam)`}
        />
      </div>

      {/* Distribuição geográfica */}
      <div className="mt-6">
        <GeographicChart
          data={leadsByState}
          title="Distribuição Geográfica dos Leads"
        />
      </div>

      {/* Métricas de Elegibilidade */}
      <div className="mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Briefcase className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Análise de Elegibilidade</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {workPermitData.find(item => item.category === 'Possui Work Permit')?.leads || 0}
              </div>
              <div className="text-sm text-gray-600">Leads Elegíveis</div>
              <div className="text-xs text-green-600 mt-1">Com permissão de trabalho</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {workPermitData.find(item => item.category === 'Não possui Work Permit')?.leads || 0}
              </div>
              <div className="text-sm text-gray-600">Leads Não Elegíveis</div>
              <div className="text-xs text-red-600 mt-1">Sem permissão de trabalho</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {((workPermitData.find(item => item.category === 'Possui Work Permit')?.leads || 0) / totalWorkPermit * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Elegibilidade</div>
              <div className="text-xs text-blue-600 mt-1">Leads qualificados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Funil de vendas */}
      <div className="grid grid-cols-1 gap-6">
        <FunnelChart
          data={funnelStages}
          title="Funil de Vendas - Etapas"
          conversionRates={conversionRates}
        />
      </div>

      {/* Resumo por região */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Resumo Geográfico</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {leadsByState.filter(s => s.state.includes('Florida') || s.state === 'FL' || s.state === 'Flórida').reduce((sum, s) => sum + s.leads, 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Florida</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {leadsByState.filter(s => s.state.includes('California')).reduce((sum, s) => sum + s.leads, 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">California</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {leadsByState.filter(s => s.state.includes('Massachusetts') || s.state === 'MA' || s.state === 'Massachussets').reduce((sum, s) => sum + s.leads, 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Massachusetts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;