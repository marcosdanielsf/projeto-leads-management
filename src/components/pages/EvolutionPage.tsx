import React from 'react';
import { TrendingUp, ArrowRight, Target, Users, Calendar, CheckCircle } from 'lucide-react';
import { useSupabaseData, parseCSVData } from '../../utils/csvParser';

const EvolutionPage: React.FC = () => {
  const supabaseData = useSupabaseData();
  
  // Usar dados do Supabase se disponíveis, senão usar dados simulados
  const data = supabaseData.loading || supabaseData.error ? parseCSVData() : supabaseData;
  const { conversionRates, monthlyEvolution } = data;

  const evolutionData = monthlyEvolution.map(item => ({
    ...item,
    rate: item.leads > 0 ? Math.round((item.conversions / item.leads) * 100) : 0
  }));

  const maxLeads = Math.max(...evolutionData.map(d => d.leads));
  const maxConversions = Math.max(...evolutionData.map(d => d.conversions));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evolução de Performance</h1>
          <p className="text-gray-600 mt-1">Acompanhe o progresso e taxas de conversão ao longo do tempo</p>
        </div>
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <span className="text-lg font-semibold text-green-600">+24.3% este mês</span>
        </div>
      </div>

      {/* Gráfico de evolução mensal */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Evolução Mensal - Leads vs Conversões</h3>
        <div className="space-y-6">
          {evolutionData.map((data, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                <div className="flex-1 mx-4 space-y-2">
                  {/* Barra de Leads */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 w-16">Leads</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(data.leads / maxLeads) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 w-8">{data.leads}</span>
                  </div>
                  {/* Barra de Conversões */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 w-16">Conversões</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(data.conversions / maxConversions) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 w-8">{data.conversions}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-purple-600">{data.rate}%</span>
                  <p className="text-xs text-gray-500">Taxa</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fluxo de conversão detalhado */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Fluxo de Conversão Detalhado</h3>
        <div className="space-y-4">
          {conversionRates.map((conversion, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {conversion.from}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {conversion.to}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-800">{conversion.leads} leads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className={`text-sm font-bold ${
                    conversion.rate > 50 ? 'text-green-600' : 
                    conversion.rate > 20 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {conversion.rate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-800">Tempo Médio no Funil</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ativação → Qualificação</span>
              <span className="text-sm font-semibold">2.3 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Qualificação → Sondagem</span>
              <span className="text-sm font-semibold">1.8 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sondagem → Agendamento</span>
              <span className="text-sm font-semibold">3.2 dias</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-800">Tempo Total Médio</span>
              <span className="text-sm font-bold text-blue-600">12.5 dias</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h4 className="text-lg font-semibold text-gray-800">Taxa de Sucesso</h4>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">27.09%</div>
            <p className="text-sm text-gray-600 mb-4">Taxa de conversão (55/203 elegíveis)</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="w-[27.09%] bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-semibold text-gray-800">Tendência</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mês Anterior</span>
              <span className="text-sm font-semibold text-gray-800">22.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mês Atual</span>
              <span className="text-sm font-semibold text-green-600">27.09%</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-800">Melhoria</span>
              <span className="text-sm font-bold text-green-600">+4.99%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionPage;