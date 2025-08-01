
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
      status: (isConnected ? 'online' : 'offline') as 'online' | 'offline' | 'maintenance',
      batteryLevel: telemetry?.battery_v ?? 0,
      signalStrength: 100,
      active: true,
      lastSeen: new Date().toISOString(),
      firmwareVersion: telemetry?.fw ?? '1.0.0',
      serialNumber: 'RW-0023',
      coordinates: { 
        latitude: telemetry?.gps.lat ?? 5.6037, 
        longitude: telemetry?.gps.lon ?? -0.1870 
      },
    },
  ];

  const selectedDeviceData = devices.find((device) => device.id === selectedDevice) || devices[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                RiverWatcher
              </h1>
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                <button className="nav-button active">Dashboard</button>
                <button className="nav-button">Sensors</button>
                <button className="nav-button">Map View</button>
                <button className="nav-button">Alerts</button>
                <button className="nav-button">Settings</button>
              </nav>
            </div>
            
            <WebSocketStatusIndicator 
              isConnected={isConnected}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Device Selector */}
        <div className="device-selector">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Device Selection</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">Select a device from the swarm to view its data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-3">
              <ToggleGroup
                type="single"
                value={selectedDevice}
                onValueChange={(value) => value && setSelectedDevice(value)}
                className="bg-muted/50 rounded-lg p-1"
              >
                {devices.map((device) => (
                  <ToggleGroupItem
                    key={device.id}
                    value={device.id}
                    aria-label={device.name}
                    className={`px-4 py-2 rounded-md font-medium transition-all data-[state=on]:bg-primary data-[state=on]:text-primary-foreground ${
                      device.status === 'offline' ? 'opacity-50' : ''
                    }`}
                    disabled={device.status === 'offline'}
                  >
                    {device.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <button
                onClick={() => setShowDeviceDetails(true)}
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Cpu className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${
                  selectedDeviceData.status === 'online'
                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                    : selectedDeviceData.status === 'maintenance'
                    ? 'bg-amber-500 shadow-lg shadow-amber-500/50'
                    : 'bg-red-500 shadow-lg shadow-red-500/50'
                }`}
              />
              <span className="font-medium capitalize">{selectedDeviceData.status}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{selectedDeviceData.location}</span>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <WaterQualityCard 
            title="pH Level" 
            value={telemetry?.ph ?? 0} 
            unit="pH" 
            change={0} 
            status="neutral" 
            type="ph" 
          />
          <WaterQualityCard 
            title="Turbidity" 
            value={telemetry?.turbidity ?? 0} 
            unit="NTU" 
            change={0} 
            status="neutral" 
            type="temperature" 
          />
          <WaterQualityCard 
            title="Conductivity" 
            value={telemetry?.conductivity ?? 0} 
            unit="µS/cm" 
            change={0} 
            status="neutral" 
            type="flow" 
          />
          <WaterQualityCard 
            title="ISE Value" 
            value={telemetry?.ise_value ?? 0} 
            unit="mV" 
            change={0} 
            status="neutral" 
            type="oxygen" 
          />
          <WaterQualityCard 
            title="Mercury" 
            value={telemetry?.mercury_ppb ?? 0} 
            unit="ppb" 
            change={0} 
            status="neutral" 
            type="mercury" 
          />
          <WaterQualityCard 
            title="Battery" 
            value={telemetry?.battery_v ?? 0} 
            unit="V" 
            change={0} 
            status="neutral" 
            type="battery" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 chart-container">
            <WaterLevelChart />
          </div>
          <div className="chart-container">
            <WaterFlowGauge 
              value={telemetry?.conductivity ?? 0} 
              maxValue={5000} 
              title="Conductivity Gauge" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="chart-container">
            <PollutionChart />
          </div>
          <div className="chart-container">
            <StationsMap />
          </div>
        </div>
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
