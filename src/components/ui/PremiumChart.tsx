import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import PremiumCard from './PremiumCard';

interface ChartDataPoint {
  name: string;
  value: number;
  trend?: number;
  color?: string;
  [key: string]: string | number | undefined;
}

interface PremiumChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line' | 'area' | 'pie';
  title?: string;
  subtitle?: string;
  height?: number;
  showTrend?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
  colorScheme?: 'primary' | 'neon' | 'brand' | 'semantic';
  className?: string;
}

const PremiumChart: React.FC<PremiumChartProps> = ({
  data,
  type = 'bar',
  title,
  subtitle,
  height = 300,
  showTrend = true,
  showTooltip = true,
  interactive = true,
  colorScheme = 'brand',
  className
}) => {
  const [selectedDataKey, setSelectedDataKey] = useState<string>('value');

  const colorSchemes = {
    primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    neon: ['#af44ca', '#e879f9', '#f0abfc', '#f5d0fe'],
    brand: ['#af44ca', '#3b82f6', '#22c55e', '#f59e0b'],
    semantic: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6']
  };

  const colors = colorSchemes[colorScheme];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number | string;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-lg p-3 border border-white/20 shadow-floating">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-white/80 text-sm">
              <span className="inline-block w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }} />
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const percentage = ((lastValue - firstValue) / firstValue) * 100;
    
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };

  const trend = calculateTrend();

  const TrendIndicator = () => {
    const Icon = trend.direction === 'up' ? TrendingUp : 
                trend.direction === 'down' ? TrendingDown : Minus;
    
    const colorClass = trend.direction === 'up' ? 'text-semantic-success-500' :
                      trend.direction === 'down' ? 'text-semantic-error-500' :
                      'text-neutral-400';

    return (
      <div className={cn('flex items-center gap-1 text-sm', colorClass)}>
        <Icon className="w-4 h-4" />
        <span>{trend.percentage.toFixed(1)}%</span>
      </div>
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      height
    };

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <Bar 
                dataKey={selectedDataKey}
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                className="transition-all duration-200"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[0]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <Line 
                type="monotone" 
                dataKey={selectedDataKey}
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors[1], stroke: colors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <Area 
                type="monotone" 
                dataKey={selectedDataKey}
                stroke={colors[0]}
                fill={`url(#gradient-${colorScheme})`}
                strokeWidth={2}
              />
              <defs>
                <linearGradient id={`gradient-${colorScheme}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={height / 3}
                fill={colors[0]}
                dataKey={selectedDataKey}
                label={({ name, percent }: { name: string; percent?: number }) => 
                  `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <PremiumCard variant="glass-dark" className={cn('p-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-white mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-white/60">
              {subtitle}
            </p>
          )}
        </div>
        
        {showTrend && (
          <div className="flex items-center gap-2">
            <TrendIndicator />
            <Info className="w-4 h-4 text-white/40" />
          </div>
        )}
      </div>

      {/* Chart Controls */}
      {interactive && Object.keys(data[0] || {}).filter(key => key !== 'name' && typeof data[0][key] === 'number').length > 1 && (
        <div className="flex gap-2 mb-4">
          {Object.keys(data[0] || {}).filter(key => key !== 'name' && typeof data[0][key] === 'number').map((key) => (
            <button
              key={key}
              onClick={() => setSelectedDataKey(key)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200',
                selectedDataKey === key
                  ? 'bg-neon-500/20 text-neon-400 border border-neon-500/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              )}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="relative">
        {renderChart()}
        
        {/* Interactive indicator */}
        {interactive && (
          <div className="absolute top-2 right-2 glass rounded-lg p-2">
            <p className="text-xs text-white/80">
              Interactive Chart
            </p>
          </div>
        )}
      </div>

      {/* Data insights */}
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-white/60">Total</p>
              <p className="text-sm font-medium text-white">
                {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60">Média</p>
              <p className="text-sm font-medium text-white">
                {(data.reduce((sum, item) => sum + item.value, 0) / data.length).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60">Máximo</p>
              <p className="text-sm font-medium text-white">
                {Math.max(...data.map(item => item.value)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </PremiumCard>
  );
};

export default PremiumChart;