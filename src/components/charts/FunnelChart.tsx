import React from 'react';
import { FunnelStage, ConversionData } from '../../types';
import { ArrowDown } from 'lucide-react';

interface FunnelChartProps {
  data: FunnelStage[];
  title: string;
  conversionRates?: ConversionData[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, title, conversionRates = [] }) => {
  const maxLeads = Math.max(...data.map(stage => stage.leads));
  
  const colors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-red-500 to-red-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-pink-500 to-pink-600',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="space-y-6">
        {data.map((stage, index) => {
          const widthPercentage = (stage.leads / maxLeads) * 100;
          const nextStage = data[index + 1];
          const conversionRate = conversionRates.find(rate => 
            rate.from.toLowerCase().includes(stage.stage.toLowerCase().split(' ')[0])
          );
          
          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-900">{stage.leads} leads</span>
                  {conversionRate && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {conversionRate.rate.toFixed(1)}% conversão
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-lg h-8 overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]} transition-all duration-1000 ease-out flex items-center justify-center`}
                    style={{ width: `${widthPercentage}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {widthPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Seta de conversão */}
              {nextStage && (
                <div className="flex items-center justify-center mt-3 mb-1">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <ArrowDown className="w-4 h-4" />
                    {conversionRate && (
                      <span className="text-xs font-medium">
                        {conversionRate.rate.toFixed(1)}% → {nextStage.leads} leads
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelChart;