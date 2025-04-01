
import React from 'react';
import WaterQualityCard from './WaterQualityCard';
import WaterLevelChart from './WaterLevelChart';
import PollutionChart from './PollutionChart';
import StationsMap from './StationsMap';
import WaterFlowGauge from './WaterFlowGauge';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">River Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Last updated: </span>
          <span className="text-sm text-river-blue-light">May 15, 2023 14:30</span>
        </div>
      </div>
      
      {/* Water quality metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <WaterQualityCard 
          title="pH Level" 
          value={7.2} 
          unit="pH" 
          change={0.5} 
          status="positive" 
          type="ph" 
        />
        <WaterQualityCard 
          title="Dissolved Oxygen" 
          value={8.6} 
          unit="mg/L" 
          change={-0.3} 
          status="negative" 
          type="oxygen" 
        />
        <WaterQualityCard 
          title="Temperature" 
          value={18.5} 
          unit="°C" 
          change={1.2} 
          status="neutral" 
          type="temperature" 
        />
        <WaterQualityCard 
          title="Flow Rate" 
          value={23.6} 
          unit="m³/s" 
          change={2.1} 
          status="positive" 
          type="flow" 
        />
        <WaterQualityCard 
          title="Lead Level" 
          value={0.012} 
          unit="mg/L" 
          change={0.5} 
          status="negative" 
          type="lead" 
        />
        <WaterQualityCard 
          title="Mercury Cyanide" 
          value={0.003} 
          unit="mg/L" 
          change={-0.2} 
          status="positive" 
          type="mercury" 
        />
      </div>
      
      {/* Main charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WaterLevelChart />
        </div>
        <WaterFlowGauge value={23} maxValue={30} title="Current Flow Rate" />
      </div>
      
      {/* Second row of visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PollutionChart />
        <StationsMap />
      </div>
    </div>
  );
};

export default Dashboard;
