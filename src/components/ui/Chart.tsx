import React from 'react';

interface ChartData {
  name: string;
  deployments: number;
  incidents: number;
}

interface ChartProps {
  data: ChartData[];
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.deployments, d.incidents]));
  
  return (
    <div className="h-64 flex items-end space-x-2 px-4">
      {data.map((item, index) => (
        <div key={item.name} className="flex-1 flex flex-col items-center space-y-2">
          {/* Bars */}
          <div className="w-full flex flex-col space-y-1">
            {/* Deployments bar */}
            <div
              className="w-full bg-blue-500 transition-all duration-300 hover:bg-blue-600"
              style={{
                height: `${(item.deployments / maxValue) * 180}px`,
                minHeight: item.deployments > 0 ? '4px' : '0px',
              }}
              title={`Deployments: ${item.deployments}`}
            ></div>
            
            {/* Incidents bar */}
            <div
              className="w-full bg-red-500 transition-all duration-300 hover:bg-red-600"
              style={{
                height: `${(item.incidents / maxValue) * 180}px`,
                minHeight: item.incidents > 0 ? '4px' : '0px',
              }}
              title={`Incidents: ${item.incidents}`}
            ></div>
          </div>
          
          {/* Labels */}
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {item.name}
            </div>
            <div className="flex space-x-1 text-xs">
              <span className="text-blue-600 dark:text-blue-400">{item.deployments}</span>
              <span className="text-gray-400">/</span>
              <span className="text-red-600 dark:text-red-400">{item.incidents}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};