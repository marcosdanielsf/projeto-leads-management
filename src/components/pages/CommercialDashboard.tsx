import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Clock, CheckCircle } from 'lucide-react';

// Dados do funil de vendas
const funnelData = [
  { stage: 'Etapa 1 - Ativação', leads: 84, color: '#3B82F6', percentage: '38.7%' },
  { stage: 'Etapa 2 - Qualificação', leads: 17, color: '#10B981', percentage: '7.8%' },
  { stage: 'Etapa 3 - Sondagem', leads: 13, color: '#F59E0B', percentage: '6.0%' },
  { stage: 'Etapa 4 - Dados p/ Agendamento', leads: 48, color: '#EF4444', percentage: '22.1%' },
  { stage: 'Etapa 5 - Agendamento', leads: 6, color: '#8B5CF6', percentage: '2.8%' },
  { stage: 'Etapa 6 - Reagendamento', leads: 26, color: '#EC4899', percentage: '12.0%' },
  { stage: 'Etapa 7 - Meeting Realizado', leads: 23, color: '#06B6D4', percentage: '10.6%' }
];

// Dados de desqualificação
const disqualifiedLeads = 84; // Leads sem resposta considerados desqualificados

// Dados de Work Permit
const workPermitData = [
  { name: 'Possuem', value: 105, color: '#10B981' },
  { name: 'Não possuem', value: 14, color: '#EF4444' },
  { name: 'Sem resposta', value: 98, color: '#6B7280' }
];

// Dados de localização normalizados
const locationData = [
  { state: 'Florida', leads: 45, percentage: '35.2%' }, // Florida + Flórida + FL
  { state: 'Massachusetts', leads: 21, percentage: '16.4%' }, // Massachusetts + MA + Massachussets
  { state: 'California', leads: 13, percentage: '10.2%' },
  { state: 'Texas', leads: 9, percentage: '7.0%' },
  { state: 'Utah', leads: 4, percentage: '3.1%' },
  { state: 'New Jersey', leads: 5, percentage: '3.9%' }, // New Jersey + NJ e FL (parcial)
  { state: 'Georgia', leads: 5, percentage: '3.9%' }, // Georgia + GA
  { state: 'New York', leads: 5, percentage: '3.9%' }, // New York + Nova York + NY Westchester
  { state: 'Illinois', leads: 3, percentage: '2.3%' },
  { state: 'Colorado', leads: 2, percentage: '1.6%' }
];

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-opacity-20 ${color.includes('blue') ? 'bg-blue-500' : color.includes('green') ? 'bg-green-500' : color.includes('yellow') ? 'bg-yellow-500' : color.includes('purple') ? 'bg-purple-500' : 'bg-gray-500'}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

const CommercialDashboard: React.FC = () => {
  const totalLeads = 217;
  const qualifiedLeads = 17;
  const scheduledLeads = 55;
  const meetingsHeld = 23;
  const conversionRate = 27.09;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-bold text-white">MOTTIVME SALES</h1>
        </div>
        <h2 className="text-2xl font-bold text-blue-400 mb-2">OVERVIEW COMERCIAL</h2>
        <div className="flex space-x-8 text-sm">
          <span className="text-blue-400 border-b-2 border-blue-400 pb-1">TRÁFEGO</span>
          <span className="text-gray-400">BPO</span>
          <span className="text-gray-400">TOTAL</span>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="Total de Leads"
          value={totalLeads.toLocaleString()}
          icon={Users}
          color="text-blue-400"
        />
        <MetricCard
          title="Qualificados"
          value={qualifiedLeads}
          subtitle="7.8% do total"
          icon={Target}
          color="text-green-400"
        />
        <MetricCard
          title="Agendados"
          value={scheduledLeads}
          subtitle="25.3% dos elegíveis"
          icon={Clock}
          color="text-yellow-400"
        />
        <MetricCard
          title="Meetings Realizados"
          value={meetingsHeld}
          subtitle="10.6% do total"
          icon={CheckCircle}
          color="text-purple-400"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${conversionRate}%`}
          subtitle="Agendados/Elegíveis"
          icon={TrendingUp}
          color="text-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funil de Vendas */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Funil de Vendas - Distribuição por Etapas</h3>
          
          {/* Resumo do Funil */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">Total de Leads</div>
              <div className="text-2xl font-bold text-white">217</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">Leads Desqualificados</div>
              <div className="text-2xl font-bold text-red-400">{disqualifiedLeads}</div>
              <div className="text-xs text-gray-500">Sem resposta</div>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="stage" type="category" stroke="#9CA3AF" width={150} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value) => [`${value} leads`, 'Quantidade']}
              />
              <Bar dataKey="leads">
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Lista Detalhada das Etapas */}
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Detalhamento por Etapa:</h4>
            {funnelData.map((stage, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{stage.stage}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-white font-semibold">{stage.leads}</span>
                  <span className="text-gray-400 text-sm">{stage.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Permit Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Status Work Permit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workPermitData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(1)}%)`}
              >
                {workPermitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição Geográfica */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Localização dos Leads</h3>
          <div className="space-y-3">
            {locationData.map((location) => (
              <div key={location.state} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">{location.state}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-white font-semibold">{location.leads}</span>
                  <span className="text-gray-400 text-sm">{location.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversão Final */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Análise de Conversão</h3>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Taxa de Conversão Final</h4>
              <div className="text-3xl font-bold text-white mb-2">{conversionRate}%</div>
              <div className="text-sm text-gray-400">
                Fórmula: (Agendados ÷ Elegíveis) × 100
              </div>
              <div className="text-sm text-gray-400">
                ({scheduledLeads} ÷ 203) × 100 = {conversionRate}%
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">Leads Elegíveis</div>
                <div className="text-xl font-bold text-green-400">203</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">Leads Agendados</div>
                <div className="text-xl font-bold text-blue-400">{scheduledLeads}</div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">Leads sem Work Permit</div>
              <div className="text-xl font-bold text-red-400">14</div>
              <div className="text-xs text-gray-500">Excluídos do cálculo de elegibilidade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialDashboard;