
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Layers, Info, MapPin, Search, Navigation, Zap, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';

// Mock device data for the map
const devices = [
  { 
    id: 'RW-001', 
    name: 'Alpha Station', 
    location: 'River Thames, UK', 
    coordinates: [51.5074, -0.1278], 
    status: 'online',
    metrics: {
      ph: 6.8,
      turbidity: 12.3,
      conductivity: 275,
      ise: 0.27,
      mercury: 0.009,
      battery: 78
    }
  },
  { 
    id: 'RW-002', 
    name: 'Beta Station', 
    location: 'Lake Victoria, Uganda', 
    coordinates: [0.0235, 32.8617], 
    status: 'online',
    metrics: {
      ph: 7.2,
      turbidity: 8.7,
      conductivity: 310,
      ise: 0.31,
      mercury: 0.007,
      battery: 92
    }
  },
  { 
    id: 'RW-003', 
    name: 'Gamma Station', 
    location: 'Amazon River, Brazil', 
    coordinates: [-3.4653, -58.3800], 
    status: 'online',
    metrics: {
      ph: 7.5,
      turbidity: 14.2,
      conductivity: 290,
      ise: 0.28,
      mercury: 0.011,
      battery: 45
    }
  },
  { 
    id: 'RW-004', 
    name: 'Delta Station', 
    location: 'Mississippi River, USA', 
    coordinates: [29.9511, -90.0715], 
    status: 'online',
    metrics: {
      ph: 6.9,
      turbidity: 10.5,
      conductivity: 320,
      ise: 0.25,
      mercury: 0.008,
      battery: 65
    }
  },
  { 
    id: 'RW-005', 
    name: 'Epsilon Station', 
    location: 'Nile River, Egypt', 
    coordinates: [30.0444, 31.2357], 
    status: 'offline',
    metrics: {
      ph: 8.1,
      turbidity: 9.3,
      conductivity: 345,
      ise: 0.33,
      mercury: 0.006,
      battery: 23
    }
  },
];

const MapView: React.FC = () => {
  const { isConnected, error, reconnect } = useMapWebSocket();
  const [selectedDevice, setSelectedDevice] = React.useState<typeof devices[0] | null>(null);

  const handleDeviceClick = (device: typeof devices[0]) => {
    setSelectedDevice(device);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Map View</h1>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-river-success' : 'bg-river-danger'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Live Data' : 'Offline'}
          </span>
          {error && (
            <Button variant="outline" size="sm" onClick={reconnect}>
              Reconnect
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-3/4">
          <Card className="river-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Device Locations</CardTitle>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Layers className="h-4 w-4 mr-2" /> Layers
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Satellite View</DropdownMenuItem>
                      <DropdownMenuItem>Terrain View</DropdownMenuItem>
                      <DropdownMenuItem>Water Bodies</DropdownMenuItem>
                      <DropdownMenuItem>Weather Overlay</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All Devices</DropdownMenuItem>
                      <DropdownMenuItem>Online Only</DropdownMenuItem>
                      <DropdownMenuItem>Offline Only</DropdownMenuItem>
                      <DropdownMenuItem>Alert Status</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 rounded-b-lg overflow-hidden">
              <div className="relative h-[500px] bg-secondary/50 flex items-center justify-center">
                {/* Map placeholder - in a real app, this would be a Leaflet or Mapbox component */}
                <div className="text-center">
                  <MapPin className="h-12 w-12 mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Interactive map would be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-2">Map view would show all device locations with status indicators</p>
                  <div className="flex justify-center gap-6 mt-4">
                    {devices.map((device) => (
                      <Button 
                        key={device.id} 
                        variant="outline"
                        size="sm"
                        className={`${selectedDevice?.id === device.id ? 'bg-secondary' : ''}`}
                        onClick={() => handleDeviceClick(device)}
                      >
                        <MapPin className={`h-4 w-4 mr-2 ${device.status === 'online' ? 'text-river-success' : 'text-river-danger'}`} />
                        {device.id}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full xl:w-1/4 space-y-4">
          <Card className="river-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4" />
                Find Device
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search by device ID or name..." className="mb-3" />
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {devices.map((device) => (
                  <Button 
                    key={device.id}
                    variant="ghost" 
                    className="w-full justify-start text-left" 
                    size="sm"
                    onClick={() => handleDeviceClick(device)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${device.status === 'online' ? 'bg-river-success' : 'bg-river-danger'}`}></div>
                      <span>{device.id} - {device.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="river-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Map Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-river-success"></div>
                <span className="text-sm">Online device</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-river-danger"></div>
                <span className="text-sm">Offline device</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-river-warning"></div>
                <span className="text-sm">Warning condition</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-river-purple-light"></div>
                <span className="text-sm">Selected device</span>
              </div>
            </CardContent>
          </Card>

          {selectedDevice ? (
            <Card className="river-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Selected Device
                  </div>
                  <Badge className={selectedDevice.status === 'online' ? 'bg-river-success' : 'bg-river-danger'}>
                    {selectedDevice.status === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedDevice.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDevice.id}</p>
                  <p className="text-sm text-muted-foreground">{selectedDevice.location}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Zap className="h-3 w-3 text-river-blue-light" /> pH Level
                    </span>
                    <span className="font-medium">{selectedDevice.metrics.ph}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Zap className="h-3 w-3 text-river-purple-light" /> Turbidity
                    </span>
                    <span className="font-medium">{selectedDevice.metrics.turbidity} NTU</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Zap className="h-3 w-3 text-river-success" /> Conductivity
                    </span>
                    <span className="font-medium">{selectedDevice.metrics.conductivity} μS/cm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-river-warning" /> Mercury
                    </span>
                    <span className="font-medium">{selectedDevice.metrics.mercury} ppb</span>
                  </div>
                </div>
                
                <div className="pt-2 flex gap-2">
                  <Button size="sm" className="w-full" asChild>
                    <a href={`/devices/${selectedDevice.id}`}>View Details</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="river-card">
              <CardContent className="py-6">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Select a device on the map to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
