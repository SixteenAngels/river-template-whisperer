
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Download, Battery, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Mock device data
const mockDevices = [
  { id: 'RW-001', name: 'Alpha Station', location: 'River Thames, UK', lastSeen: '2 mins ago', status: 'online', battery: 78, ph: 6.8 },
  { id: 'RW-002', name: 'Beta Station', location: 'Lake Victoria, Uganda', lastSeen: '5 mins ago', status: 'online', battery: 92, ph: 7.2 },
  { id: 'RW-003', name: 'Gamma Station', location: 'Amazon River, Brazil', lastSeen: '10 mins ago', status: 'online', battery: 45, ph: 7.5 },
  { id: 'RW-004', name: 'Delta Station', location: 'Mississippi River, USA', lastSeen: '30 mins ago', status: 'online', battery: 65, ph: 6.9 },
  { id: 'RW-005', name: 'Epsilon Station', location: 'Nile River, Egypt', lastSeen: '1 hour ago', status: 'offline', battery: 23, ph: 8.1 },
  { id: 'RW-006', name: 'Zeta Station', location: 'Ganges River, India', lastSeen: '3 hours ago', status: 'offline', battery: 12, ph: 6.5 },
  { id: 'RW-007', name: 'Eta Station', location: 'Yangtze River, China', lastSeen: '10 mins ago', status: 'online', battery: 87, ph: 7.1 },
  { id: 'RW-008', name: 'Theta Station', location: 'Murray River, Australia', lastSeen: '45 mins ago', status: 'online', battery: 56, ph: 7.3 },
];

const Devices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [phFilter, setPhFilter] = useState<string | null>(null);
  const [batteryFilter, setBatteryFilter] = useState<string | null>(null);

  // Filter devices based on search and filters
  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = searchTerm === '' || 
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      device.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === null || device.status === statusFilter;
    
    const matchesPh = phFilter === null || 
      (phFilter === 'acidic' && device.ph < 7) || 
      (phFilter === 'neutral' && device.ph >= 7 && device.ph <= 7.5) || 
      (phFilter === 'alkaline' && device.ph > 7.5);
      
    const matchesBattery = batteryFilter === null || 
      (batteryFilter === 'low' && device.battery < 30) || 
      (batteryFilter === 'medium' && device.battery >= 30 && device.battery < 70) || 
      (batteryFilter === 'high' && device.battery >= 70);
      
    return matchesSearch && matchesStatus && matchesPh && matchesBattery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Devices</h1>
        <Button>
          <Link to="/add-device" className="flex items-center">Add New Device</Link>
        </Button>
      </div>

      <Card className="river-card">
        <CardHeader className="pb-3">
          <CardTitle>Device Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" /> Status
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('online')}>
                    Online
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('offline')}>
                    Offline
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" /> pH Level
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPhFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPhFilter('acidic')}>
                    Acidic (&lt;7)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPhFilter('neutral')}>
                    Neutral (7-7.5)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPhFilter('alkaline')}>
                    Alkaline (&gt;7.5)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" /> Battery
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setBatteryFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBatteryFilter('low')}>
                    Low (&lt;30%)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBatteryFilter('medium')}>
                    Medium (30-70%)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBatteryFilter('high')}>
                    High (&gt;70%)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="h-10">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Battery</TableHead>
                  <TableHead className="hidden md:table-cell">Last Seen</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{device.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {device.status === 'online' ? (
                          <Badge className="bg-river-success">
                            <Wifi className="h-3 w-3 mr-1" /> Online
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-river-danger border-river-danger">
                            <WifiOff className="h-3 w-3 mr-1" /> Offline
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Battery className={`h-4 w-4 ${
                          device.battery < 30 ? 'text-river-danger' :
                          device.battery < 70 ? 'text-river-warning' :
                          'text-river-success'
                        }`} />
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              device.battery < 30 ? 'bg-river-danger' :
                              device.battery < 70 ? 'bg-river-warning' :
                              'bg-river-success'
                            }`}
                            style={{ width: `${device.battery}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{device.battery}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{device.lastSeen}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/devices/${device.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredDevices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No devices found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Devices;
