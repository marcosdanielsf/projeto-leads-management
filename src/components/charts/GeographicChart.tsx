import React from 'react';
import { MapPin } from 'lucide-react';

interface GeographicChartProps {
  data: Array<{ state: string; leads: number }>;
  title: string;
}

const GeographicChart: React.FC<GeographicChartProps> = ({ data, title }) => {
  const maxLeads = Math.max(...data.map(item => item.leads));
  
  const getStateColor = (leads: number) => {
    const intensity = (leads / maxLeads) * 100;
    if (intensity >= 80) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (intensity >= 60) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (intensity >= 40) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (intensity >= 20) return 'bg-gradient-to-r from-green-500 to-green-600';
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  const getIntensityLabel = (leads: number) => {
    const intensity = (leads / maxLeads) * 100;
    if (intensity >= 80) return 'Muito Alto';
    if (intensity >= 60) return 'Alto';
    if (intensity >= 40) return 'Médio';
    if (intensity >= 20) return 'Baixo';
    return 'Muito Baixo';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.slice(0, 12).map((item, index) => {
          const widthPercentage = (item.leads / maxLeads) * 100;
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {item.state}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {item.leads}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${getStateColor(item.leads)} transition-all duration-1000 ease-out`}
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {getIntensityLabel(item.leads)}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {widthPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legenda */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Intensidade de Leads</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
            <span className="text-xs text-gray-600">Muito Alto (80%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
            <span className="text-xs text-gray-600">Alto (60-79%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded"></div>
            <span className="text-xs text-gray-600">Médio (40-59%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
            <span className="text-xs text-gray-600">Baixo (20-39%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
            <span className="text-xs text-gray-600">Muito Baixo (0-19%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicChart;