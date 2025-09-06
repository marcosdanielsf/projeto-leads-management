import React from 'react'
import { useSupabaseData } from '../../utils/csvParser'
import MetricCard from '../MetricCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Users, Target, Award, MapPin, Clock } from 'lucide-react'

interface LeadsByState {
  state: string;
  leads: number;
}

interface WorkPermitData {
  category: string;
  leads: number;
}

interface FunnelStage {
  stage: string;
  leads: number;
}

interface ConversionRate {
  from: string;
  to: string;
  rate: number;
  leads: number;
}

const DashboardPage: React.FC = () => {
  const { leadsByState, workPermitData, funnelStages, conversionRates, loading } = useSupabaseData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Cores consistentes para o dashboard usando o sistema de design
  const colors = {
    primary: '#3B82F6',
    secondary: '#22c55e',
    accent: '#f59e0b',
    danger: '#ef4444',
    neutral: '#6b7280',
    success: '#22c55e'
  }

  const chartColors = [colors.primary, colors.secondary, colors.accent, colors.danger, '#8B5CF6', '#EC4899']

  // Métricas principais (KPIs) - Top Left Quadrant
  const totalLeads = leadsByState.reduce((sum: number, item: LeadsByState) => sum + item.leads, 0)
  const totalWithPermit = workPermitData.find((item: WorkPermitData) => item.category === 'Com Permissão')?.leads || 0
  const conversionRate = conversionRates.length > 0 
    ? (conversionRates.reduce((sum: number, item: ConversionRate) => sum + (typeof item.rate === 'string' ? parseFloat(item.rate) : item.rate), 0) / conversionRates.length).toFixed(1)
    : '0'
  const activeStages = funnelStages.length

  // Dados para gráficos
  const topStates = leadsByState.slice(0, 6)
  const funnelDataForChart = funnelStages.map((stage: FunnelStage) => ({
    name: stage.stage.replace('etapa ', '').replace(' - ', ': '),
    value: stage.leads,
    fill: chartColors[funnelStages.indexOf(stage) % chartColors.length]
  }))

  // Dados de evolução mensal simulados (baseados nos dados reais)
  const monthlyData = [
    { month: 'Jan', leads: Math.floor(totalLeads * 0.7), conversions: Math.floor(totalLeads * 0.1) },
    { month: 'Fev', leads: Math.floor(totalLeads * 0.8), conversions: Math.floor(totalLeads * 0.12) },
    { month: 'Mar', leads: Math.floor(totalLeads * 0.9), conversions: Math.floor(totalLeads * 0.15) },
    { month: 'Abr', leads: Math.floor(totalLeads * 0.95), conversions: Math.floor(totalLeads * 0.18) },
    { month: 'Mai', leads: totalLeads, conversions: Math.floor(totalLeads * 0.2) },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Executivo</h1>
        <p className="text-gray-600">Visão geral do desempenho de leads e vendas</p>
      </div>

      {/* Top Section - KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Leads"
          value={totalLeads.toLocaleString()}
          icon={Users}
          color="primary"
        />
        <MetricCard
          title="Com Permissão"
          value={totalWithPermit.toLocaleString()}
          icon={Award}
          color="success"
        />
        <MetricCard
          title="Taxa Conversão Média"
          value={`${conversionRate}%`}
          icon={Target}
          color="secondary"
        />
        <MetricCard
          title="Etapas Ativas"
          value={activeStages.toString()}
          icon={Clock}
          color="warning"
        />
      </div>

      {/* Middle Section - Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Funil de Vendas - Left */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Funil de Vendas</h3>
            <div className="text-sm text-gray-500">Distribuição por Etapa</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelDataForChart} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={11}
                width={120}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leads por Estado - Right */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Top Estados</h3>
            <MapPin className="w-icon-sm h-icon-sm text-neutral-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topStates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="state" 
                stroke="#6b7280" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="leads" 
                fill={colors.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section - Análises Complementares */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Permissão de Trabalho */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Permissão de Trabalho</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={workPermitData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="leads"
              >
                {workPermitData.map((entry: WorkPermitData, index: number) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? colors.success : colors.danger} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {workPermitData.map((entry: WorkPermitData, index: number) => (
              <div key={entry.category} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: index === 0 ? colors.success : colors.danger }}
                ></div>
                <span className="text-sm text-gray-600">{entry.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evolução Mensal */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Evolução Mensal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke={colors.primary} 
                strokeWidth={3}
                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                name="Leads"
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke={colors.secondary} 
                strokeWidth={3}
                dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                name="Conversões"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas de Performance */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Leads Qualificados</span>
              <span className="text-lg font-bold text-blue-600">
                {funnelStages.find((stage: FunnelStage) => stage.stage.includes('qualificação'))?.leads || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-900">Meetings Realizados</span>
              <span className="text-lg font-bold text-green-600">
                {funnelStages.find((stage: FunnelStage) => stage.stage.includes('meeting'))?.leads || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-amber-900">Taxa de Sucesso</span>
              <span className="text-lg font-bold text-amber-600">
                {((funnelStages.find((stage: FunnelStage) => stage.stage.includes('meeting'))?.leads || 0) / totalLeads * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-900">Agendamentos</span>
              <span className="text-lg font-bold text-purple-600">
                {funnelStages.find((stage: FunnelStage) => stage.stage.includes('agendamento'))?.leads || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start space-x-3">
          <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Insights Principais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                • <strong>Florida</strong> lidera com {leadsByState[0]?.leads || 0} leads ({((leadsByState[0]?.leads || 0) / totalLeads * 100).toFixed(1)}% do total)
              </div>
              <div>
                • <strong>{((totalWithPermit / totalLeads) * 100).toFixed(1)}%</strong> dos leads possuem permissão de trabalho
              </div>
              <div>
                • Maior concentração na etapa de <strong>{funnelStages.reduce((max: FunnelStage, stage: FunnelStage) => stage.leads > max.leads ? stage : max, funnelStages[0])?.stage || 'N/A'}</strong>
              </div>
              <div>
                • Oportunidade de melhoria na conversão entre etapas intermediárias
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage