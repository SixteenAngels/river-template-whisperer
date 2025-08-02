
'use client';

import React, { useState, useEffect } from 'react';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';
import WaterQualityCard from '@/components/dashboard/WaterQualityCard';
import WaterLevelChart from '@/components/dashboard/WaterLevelChart';
import PollutionChart from '@/components/dashboard/PollutionChart';
import StationsMap from '@/components/dashboard/StationsMap';
import WaterFlowGauge from '@/components/dashboard/WaterFlowGauge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Info, Cpu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DeviceDetailsDrawer from '@/components/devices/DeviceDetailsDrawer';
import WebSocketStatusIndicator from '@/components/sensors/WebSocketStatusIndicator';

interface Telemetry {
  device: string;
  fw: string;
  ph: number;
  turbidity: number;
  conductivity: number;
  ise_value: number;
  mercury_ppb: number;
  battery_v: number;
  gps: { lat: number; lon: number };
  location_source: string;
}

const Dashboard: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('device-1');
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  
  // Use Django WebSocket hook
  const { isConnected, sensorData, telemetryData, error, sendHeartbeat } = useDjangoWebSocket();

  // Update telemetry when new data arrives
  useEffect(() => {
    if (telemetryData) {
      setTelemetry(telemetryData);
    }
  }, [telemetryData]);

  // Send heartbeat every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      sendHeartbeat();
    }, 30000);
    return () => clearInterval(interval);
  }, [sendHeartbeat]);

  const devices = [
    {
      id: 'device-1',
      name: 'River Watcher 23',
      type: 'standard' as const,
      location: 'Volta River Bank',
      status: (isConnected && telemetry ? 'online' : 'offline') as 'online' | 'offline' | 'maintenance',
      batteryLevel: telemetry?.battery_v ?? 0,
      signalStrength: isConnected ? 100 : 0,
      active: true,
      lastSeen: telemetry ? new Date().toISOString() : new Date(Date.now() - 300000).toISOString(),
      firmwareVersion: telemetry?.fw ?? 'Unknown',
      serialNumber: 'RW-0023',
      coordinates: { 
        latitude: telemetry?.gps.lat ?? 5.6037, 
        longitude: telemetry?.gps.lon ?? -0.1870 
      },
    },
  ];

  const selectedDeviceData = devices.find((device) => device.id === selectedDevice) || devices[0];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          River Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <WebSocketStatusIndicator 
            isConnected={isConnected} 
            error={error} 
            onReconnect={() => window.location.reload()} 
          />
          {!isConnected && (
            <div className="text-xs text-muted-foreground">
              Connect your Django backend to see live data
            </div>
          )}
        </div>
      </div>

      {/* Device Selector */}
      <div className="w-full bg-background/60 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Device Selection</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Select a device from the swarm to view its data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={selectedDevice}
              onValueChange={(value) => value && setSelectedDevice(value)}
            >
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
              className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium"
            >
              <Cpu className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              selectedDeviceData.status === 'online'
                ? 'bg-green-500'
                : selectedDeviceData.status === 'maintenance'
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
          ></span>
          <span className="capitalize text-muted-foreground">{selectedDeviceData.status}</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{selectedDeviceData.location}</span>
        </div>
      </div>

      {/* Sensor Cards */}
      {!isConnected && !telemetry && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Backend Connection</h3>
          <p className="text-blue-700 mb-4">
            Connect your Django backend at <code className="bg-blue-100 px-2 py-1 rounded">ws://localhost:8000/ws/sensors/</code> to see live sensor data.
          </p>
          <div className="text-sm text-blue-600">
            Make sure your Django WebSocket server is running and accessible.
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <WaterQualityCard 
          title="pH Level" 
          value={isConnected && telemetry ? telemetry.ph : "No Data"} 
          unit="pH" 
          change={0} 
          status="neutral" 
          type="ph" 
        />
        <WaterQualityCard 
          title="Turbidity" 
          value={isConnected && telemetry ? telemetry.turbidity : "No Data"} 
          unit="NTU" 
          change={0} 
          status="neutral" 
          type="turbidity" 
        />
        <WaterQualityCard 
          title="Conductivity" 
          value={isConnected && telemetry ? telemetry.conductivity : "No Data"} 
          unit="µS/cm" 
          change={0} 
          status="neutral" 
          type="conductivity" 
        />
        <WaterQualityCard 
          title="ISE Value" 
          value={isConnected && telemetry ? telemetry.ise_value : "No Data"} 
          unit="mV" 
          change={0} 
          status="neutral" 
          type="ise" 
        />
        <WaterQualityCard 
          title="Mercury" 
          value={isConnected && telemetry ? telemetry.mercury_ppb : "No Data"} 
          unit="ppb" 
          change={0} 
          status="neutral" 
          type="mercury" 
        />
        <WaterQualityCard 
          title="Battery" 
          value={isConnected && telemetry ? telemetry.battery_v : "No Data"} 
          unit="V" 
          change={0} 
          status="neutral" 
          type="battery" 
        />
      </div>

      {/* Charts and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WaterLevelChart />
        </div>
        <WaterFlowGauge value={telemetry?.conductivity ?? 0} maxValue={5000} title="Conductivity Gauge" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PollutionChart />
        <StationsMap />
      </div>

      <DeviceDetailsDrawer
        open={showDeviceDetails}
        onClose={() => setShowDeviceDetails(false)}
        device={selectedDeviceData}
      />
    </div>
  );
};

export default Dashboard;
