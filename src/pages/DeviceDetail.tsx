
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplet, Zap, Activity, Battery, ThermometerSnowflake, Flask, AlertTriangle, Download, History, Map as MapIcon, Settings, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';

// Mock device data
const deviceData = {
  'RW-001': {
    name: 'Alpha Station',
    location: 'River Thames, UK',
    coordinates: [51.5074, -0.1278],
    lastSeen: '2 mins ago',
    status: 'online',
    battery: 78,
    ph: 6.8,
    turbidity: 12.3,
    conductivity: 275,
    ise: 0.27,
    mercury: 0.009,
    description: 'Monitoring station deployed at a key location on the River Thames. Provides critical water quality data for local environmental agencies.',
  },
  'RW-002': {
    name: 'Beta Station',
    location: 'Lake Victoria, Uganda',
    coordinates: [0.0235, 32.8617],
    lastSeen: '5 mins ago',
    status: 'online',
    battery: 92,
    ph: 7.2,
    turbidity: 8.7,
    conductivity: 310,
    ise: 0.31,
    mercury: 0.007,
    description: 'Long-term monitoring device for Lake Victoria. Part of an international research effort on large freshwater bodies.',
  },
};

// Mock historical data
const generateHistoricalData = (days = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString(),
      pH: 6.5 + Math.random() * 1.5,
      turbidity: 8 + Math.random() * 8,
      conductivity: 250 + Math.random() * 100,
      ise: 0.25 + Math.random() * 0.1,
      mercury: 0.005 + Math.random() * 0.01,
    });
  }
  
  return data;
};

const DeviceDetail: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useDjangoWebSocket();

  useEffect(() => {
    if (deviceId && deviceData[deviceId as keyof typeof deviceData]) {
      setDevice(deviceData[deviceId as keyof typeof deviceData]);
      setHistoricalData(generateHistoricalData());
    }
  }, [deviceId]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setHistoricalData(generateHistoricalData());
      setIsLoading(false);
    }, 1000);
  };

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Device not found</h1>
        <p className="text-muted-foreground mb-6">The device with ID {deviceId} could not be found.</p>
        <Button asChild>
          <Link to="/devices">Back to Devices</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/devices">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
            <p className="text-muted-foreground">{deviceId} • {device.location}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-river-success' : 'bg-river-danger'}`}></div>
          <span className="text-sm text-muted-foreground mr-2">{isConnected ? 'Live Data' : 'Offline'}</span>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Device Status Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="river-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Badge className={device.status === 'online' ? 'bg-river-success' : 'bg-river-danger'}>
                {device.status === 'online' ? 'Online' : 'Offline'}
              </Badge>
              <span className="text-sm text-muted-foreground">Last seen {device.lastSeen}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="river-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Battery className={`h-5 w-5 ${
                device.battery < 30 ? 'text-river-danger' :
                device.battery < 70 ? 'text-river-warning' :
                'text-river-success'
              }`} />
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    device.battery < 30 ? 'bg-river-danger' :
                    device.battery < 70 ? 'bg-river-warning' :
                    'bg-river-success'
                  }`}
                  style={{ width: `${device.battery}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{device.battery}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="river-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">pH Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Droplet className="h-5 w-5 text-river-blue-light" />
              <span className="text-2xl font-bold">{device.ph.toFixed(1)}</span>
              <Badge className={
                device.ph < 6.5 || device.ph > 8.5 ? 'bg-river-danger' :
                device.ph < 6.8 || device.ph > 7.8 ? 'bg-river-warning' :
                'bg-river-success'
              }>
                {device.ph < 6.5 ? 'Too Acidic' :
                 device.ph > 8.5 ? 'Too Alkaline' :
                 device.ph < 6.8 ? 'Slightly Acidic' :
                 device.ph > 7.8 ? 'Slightly Alkaline' :
                 'Optimal'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="river-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mercury Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <AlertTriangle className={`h-5 w-5 ${
                device.mercury > 0.01 ? 'text-river-danger' :
                device.mercury > 0.005 ? 'text-river-warning' :
                'text-river-success'
              }`} />
              <span className="text-2xl font-bold">{device.mercury.toFixed(3)}</span>
              <Badge className={
                device.mercury > 0.01 ? 'bg-river-danger' :
                device.mercury > 0.005 ? 'bg-river-warning' :
                'bg-river-success'
              }>
                {device.mercury > 0.01 ? 'High' :
                 device.mercury > 0.005 ? 'Moderate' :
                 'Safe'} ppb
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="telemetry">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        
        <TabsContent value="telemetry" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="river-card">
              <CardHeader>
                <CardTitle>Current Readings</CardTitle>
                <CardDescription>Live telemetry data from {device.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'pH Level', value: device.ph.toFixed(1), icon: Droplet, color: 'river-blue-light' },
                    { label: 'Turbidity', value: `${device.turbidity} NTU`, icon: Activity, color: 'river-purple-light' },
                    { label: 'Conductivity', value: `${device.conductivity} μS/cm`, icon: Zap, color: 'river-success' },
                    { label: 'ISE Value', value: `${device.ise} mV`, icon: Flask, color: 'river-warning' },
                    { label: 'Mercury', value: `${device.mercury} ppb`, icon: AlertTriangle, color: 'river-danger' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-secondary/30 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 text-${item.color}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="river-card">
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground mt-1">{device.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Coordinates</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lat: {device.coordinates[0]}, Long: {device.coordinates[1]}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Installation Date</h3>
                    <p className="text-sm text-muted-foreground mt-1">January 15, 2025</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Firmware Version</h3>
                    <p className="text-sm text-muted-foreground mt-1">v2.3.1</p>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card className="river-card">
            <CardHeader>
              <CardTitle>Historical Data</CardTitle>
              <CardDescription>Past 7 days of readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={historicalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pH" stroke="#33C3F0" name="pH Level" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="turbidity" stroke="#9b87f5" name="Turbidity" />
                    <Line type="monotone" dataKey="conductivity" stroke="#4CAF50" name="Conductivity" />
                    <Line type="monotone" dataKey="ise" stroke="#FFC107" name="ISE Value" />
                    <Line type="monotone" dataKey="mercury" stroke="#F44336" name="Mercury (ppb)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  Download CSV
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Last 7 Days</Button>
                  <Button variant="outline" size="sm">Last 30 Days</Button>
                  <Button variant="outline" size="sm">Custom Range</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location" className="mt-6">
          <Card className="river-card">
            <CardHeader>
              <CardTitle>Device Location</CardTitle>
              <CardDescription>{device.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapIcon className="h-12 w-12 mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Map view would be displayed here</p>
                  <p className="text-xs text-muted-foreground">Coordinates: {device.coordinates[0]}, {device.coordinates[1]}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild>
                  <Link to="/map">View on Main Map</Link>
                </Button>
                <Button variant="outline">Get Directions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDetail;
