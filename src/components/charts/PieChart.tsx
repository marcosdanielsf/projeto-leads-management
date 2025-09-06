import React from 'react';

interface PieChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">{title}</h3>
      <div className="flex items-center justify-center gap-8">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = (cumulativePercentage / 100) * 360;
              const path = createPath(percentage, startAngle);
              cumulativePercentage += percentage;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                <p className="text-xs text-neutral-500">
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;