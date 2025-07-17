
import React from 'react';
import Header from '@/components/Header';
import WaterQualityCard from '@/components/dashboard/WaterQualityCard';
import WaterLevelChart from '@/components/dashboard/WaterLevelChart';
import PollutionChart from '@/components/dashboard/PollutionChart';
import StationsMap from '@/components/dashboard/StationsMap';
import WaterFlowGauge from '@/components/dashboard/WaterFlowGauge';
import RealTimeDataWidget from '@/components/dashboard/RealTimeDataWidget';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-river">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto space-y-8">
          {/* Dashboard content will be rendered here */}
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
              title="Cyanide" 
              value={0.003} 
              unit="mg/L" 
              change={-0.2} 
              status="positive" 
              type="Cyanide" 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <WaterLevelChart />
            </div>
            <WaterFlowGauge value={23} maxValue={30} title="Current Flow Rate" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PollutionChart />
            <StationsMap />
          </div>
          
          <RealTimeDataWidget />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
