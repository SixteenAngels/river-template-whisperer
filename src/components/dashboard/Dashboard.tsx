
import React, { useState } from 'react';
import WaterQualityCard from './WaterQualityCard';
import WaterLevelChart from './WaterLevelChart';
import PollutionChart from './PollutionChart';
import StationsMap from './StationsMap';
import WaterFlowGauge from './WaterFlowGauge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Info, Cpu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DeviceDetailsDrawer from '@/components/devices/DeviceDetailsDrawer';

const Dashboard: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('device-1');
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  
  // Mock device data - in a real app this would come from your MQTT connection
  const devices = [
    { 
      id: 'device-1', 
      name: 'Sensor 1',
      type: 'standard' as const, 
      location: 'North River',
      status: 'online' as const,
      batteryLevel: 85,
      signalStrength: 92,
      active: true,
      lastSeen: '2025-04-29T14:30:00',
      firmwareVersion: '1.2.3',
      serialNumber: 'RW-1001-STD',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060,
      }
    },
    { 
      id: 'device-2', 
      name: 'Sensor 2',
      type: 'pro' as const, 
      location: 'South Bridge',
      status: 'online' as const,
      batteryLevel: 92,
      signalStrength: 78,
      active: true,
      lastSeen: '2025-04-29T14:25:00',
      firmwareVersion: '2.0.1',
      serialNumber: 'RW-2045-PRO',
      coordinates: {
        latitude: 40.7129,
        longitude: -74.0061,
      }
    },
    { 
      id: 'device-3', 
      name: 'Sensor 3',
      type: 'mini' as const, 
      location: 'East Tributary',
      status: 'offline' as const,
      batteryLevel: 15,
      signalStrength: 30,
      active: false,
      lastSeen: '2025-04-28T09:15:00',
      firmwareVersion: '1.1.0',
      serialNumber: 'RW-3022-MIN',
      coordinates: {
        latitude: 40.7130,
        longitude: -74.0062,
      }
    },
    { 
      id: 'device-4', 
      name: 'Sensor 4',
      type: 'standard' as const, 
      location: 'West Bank',
      status: 'maintenance' as const,
      batteryLevel: 45,
      signalStrength: 60,
      active: false,
      lastSeen: '2025-04-27T16:45:00',
      firmwareVersion: '1.2.2',
      serialNumber: 'RW-1056-STD',
      coordinates: {
        latitude: 40.7131,
        longitude: -74.0063,
      }
    },
    { 
      id: 'device-5', 
      name: 'Sensor 5',
      type: 'pro' as const,
      location: 'City Center', 
      status: 'online' as const,
      batteryLevel: 78,
      signalStrength: 85,
      active: true,
      lastSeen: '2025-04-29T14:10:00',
      firmwareVersion: '2.0.1',
      serialNumber: 'RW-2078-PRO',
      coordinates: {
        latitude: 40.7132,
        longitude: -74.0064,
      }
    }
  ];

  const selectedDeviceData = devices.find(device => device.id === selectedDevice) || devices[0];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">River dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Last updated: </span>
          <span className="text-sm text-river-blue-light">April 30, 2025 14:30</span>
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
          
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={selectedDevice} onValueChange={(value) => value && setSelectedDevice(value)}>
              {devices.map((device) => (
                <ToggleGroupItem 
                  key={device.id} 
                  value={device.id} 
                  aria-label={device.name}
                  className={device.status === 'offline' ? 'opacity-50' : ''}
                  disabled={device.status === 'offline'}
                >
                  {device.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            
            <button 
              onClick={() => setShowDeviceDetails(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Cpu className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className={`inline-flex h-2 w-2 rounded-full ${
            selectedDeviceData.status === 'online' ? 'bg-green-500' :
            selectedDeviceData.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
          }`}></span>
          <span className="capitalize text-muted-foreground">{selectedDeviceData.status}</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{selectedDeviceData.location}</span>
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
      
      {/* Device details drawer */}
      <DeviceDetailsDrawer 
        open={showDeviceDetails} 
        onClose={() => setShowDeviceDetails(false)}
        device={selectedDeviceData}
      />
    </div>
  );
};

export default Dashboard;
