
import React, { useState } from 'react';
import WaterQualityCard from './WaterQualityCard';
import WaterLevelChart from './WaterLevelChart';
import PollutionChart from './PollutionChart';
import StationsMap from './StationsMap';
import WaterFlowGauge from './WaterFlowGauge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Dashboard: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('device-1');
  
  // Mock device data - in a real app this would come from your MQTT connection
  const devices = [
    { id: 'device-1', name: 'Sensor 1' },
    { id: 'device-2', name: 'Sensor 2' },
    { id: 'device-3', name: 'Sensor 3' },
    { id: 'device-4', name: 'Sensor 4' },
    { id: 'device-5', name: 'Sensor 5' },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">River Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Last updated: </span>
          <span className="text-sm text-river-blue-light">May 15, 2023 14:30</span>
        </div>
      </div>
      
      {/* Device selector */}
      <div className="w-full bg-background/60 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Device Selection</h2>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">Select a device from the swarm to view its data</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <ToggleGroup type="single" value={selectedDevice} onValueChange={(value) => value && setSelectedDevice(value)}>
            {devices.map((device) => (
              <ToggleGroupItem key={device.id} value={device.id} aria-label={device.name}>
                {device.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
