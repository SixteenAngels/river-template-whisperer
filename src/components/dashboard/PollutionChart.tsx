
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const pollutionData = [
  { name: 'Mon', nitrates: 30, phosphates: 25 },
  { name: 'Tue', nitrates: 28, phosphates: 23 },
  { name: 'Wed', nitrates: 32, phosphates: 27 },
  { name: 'Thu', nitrates: 35, phosphates: 29 },
  { name: 'Fri', nitrates: 31, phosphates: 26 },
  { name: 'Sat', nitrates: 26, phosphates: 21 },
  { name: 'Sun', nitrates: 25, phosphates: 20 },
];

const PollutionChart: React.FC = () => {
  return (
    <div className="river-data-card river-glow h-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium">Pollution Levels</h3>
        <div className="text-xs text-river-purple-light">μg/L</div>
      </div>
      
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={pollutionData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#E6F1FF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#E6F1FF', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(26, 31, 44, 0.8)',
                borderColor: 'rgba(126, 105, 171, 0.5)',
                borderRadius: '0.5rem',
                color: '#E6F1FF'
              }}
              labelStyle={{ color: '#E6F1FF' }}
            />
            <Bar dataKey="nitrates" fill="#33C3F0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="phosphates" fill="#7E69AB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PollutionChart;
