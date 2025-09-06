import React from 'react';

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, title, height = 300 }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">{title}</h3>
      <div className="space-y-4" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-24 text-sm font-medium text-neutral-600 truncate">
              {item.label}
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 bg-neutral-200 rounded-full h-3 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    item.color || 'bg-gradient-to-r from-primary-500 to-primary-600'
                  }`}
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                  }}
                />
              </div>
              <div className="w-12 text-sm font-semibold text-neutral-900 text-right">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;