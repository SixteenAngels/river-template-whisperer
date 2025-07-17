
import React, { useState } from 'react';
import { Calendar, Download, Filter, Search, SortAsc, SortDesc, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Generate mock telemetry logs
const generateMockLogs = (count = 50) => {
  const logs = [];
  const deviceIds = ['RW-001', 'RW-002', 'RW-003', 'RW-004', 'RW-005'];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Up to 3 days ago
    
    const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
    const ph = (6.5 + Math.random() * 2).toFixed(2);
    const turbidity = (5 + Math.random() * 20).toFixed(1);
    const conductivity = Math.floor(200 + Math.random() * 150);
    const ise = (0.2 + Math.random() * 0.2).toFixed(2);
    const mercury = (0.001 + Math.random() * 0.015).toFixed(3);
    const batteryV = (3.2 + Math.random() * 1).toFixed(1);
    
    let status = 'normal';
    if (Number(ph) < 6.5 || Number(ph) > 8.5 || Number(mercury) > 0.01 || Number(batteryV) < 3.4) {
      status = 'alert';
    } else if (Number(ph) < 6.8 || Number(ph) > 8.0 || Number(mercury) > 0.008 || Number(batteryV) < 3.6) {
      status = 'warning';
    }
    
    logs.push({
      id: `LOG-${100000 + i}`,
      deviceId,
      timestamp: date.toISOString(),
      ph,
      turbidity,
      conductivity,
      ise,
      mercury,
      batteryV,
      status
    });
  }
  
  // Sort by timestamp, newest first
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const TelemetryLogs: React.FC = () => {
  const [logs, setLogs] = useState(generateMockLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === null || log.status === statusFilter;
    
    const matchesDate = dateFilter === null || (() => {
      if (dateFilter === 'today') {
        const today = new Date().setHours(0, 0, 0, 0);
        return new Date(log.timestamp).setHours(0, 0, 0, 0) === today;
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return new Date(log.timestamp).setHours(0, 0, 0, 0) === yesterday.getTime();
      } else if (dateFilter === 'thisWeek') {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return new Date(log.timestamp) >= lastWeek;
      }
      return true;
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort the filtered logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue = a[sortBy as keyof typeof a];
    let bValue = b[sortBy as keyof typeof b];
    
    // Handle numeric values
    if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
      aValue = Number(aValue);
      bValue = Number(bValue as string);
    }
    
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate the logs
  const paginatedLogs = sortedLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Telemetry Logs</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card className="river-card">
        <CardHeader className="pb-3">
          <CardTitle>Log History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by device ID or log ID..."
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
                  <DropdownMenuItem onClick={() => setStatusFilter('normal')}>
                    Normal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('warning')}>
                    Warning
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('alert')}>
                    Alert
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Calendar className="mr-2 h-4 w-4" /> Date
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setDateFilter(null)}>
                    All Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter('today')}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter('yesterday')}>
                    Yesterday
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter('thisWeek')}>
                    Past Week
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center">
                      Timestamp
                      {sortBy === 'timestamp' && (
                        sortDir === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('deviceId')}
                  >
                    <div className="flex items-center">
                      Device ID
                      {sortBy === 'deviceId' && (
                        sortDir === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('ph')}
                  >
                    <div className="flex items-center">
                      pH
                      {sortBy === 'ph' && (
                        sortDir === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('turbidity')}
                  >
                    <div className="flex items-center">
                      Turbidity
                      {sortBy === 'turbidity' && (
                        sortDir === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort('conductivity')}
                  >
                    <div className="flex items-center">
                      Conductivity
                      {sortBy === 'conductivity' && (
                        sortDir === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort('mercury')}
                  >
                    <div className="flex items-center">
                      Mercury
                      {sortBy === 'mercury' && (
                        sortDir === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('batteryV')}
                  >
                    <div className="flex items-center">
                      Battery
                      {sortBy === 'batteryV' && (
                        sortDir === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                    <TableCell>{log.deviceId}</TableCell>
                    <TableCell className="hidden md:table-cell">{log.ph}</TableCell>
                    <TableCell className="hidden md:table-cell">{log.turbidity} NTU</TableCell>
                    <TableCell className="hidden lg:table-cell">{log.conductivity} μS/cm</TableCell>
                    <TableCell className="hidden lg:table-cell">{log.mercury} ppb</TableCell>
                    <TableCell className="hidden md:table-cell">{log.batteryV} V</TableCell>
                    <TableCell>
                      <Badge className={
                        log.status === 'alert' ? 'bg-river-danger' :
                        log.status === 'warning' ? 'bg-river-warning' :
                        'bg-river-success'
                      }>
                        {log.status === 'alert' ? 'Alert' :
                         log.status === 'warning' ? 'Warning' :
                         'Normal'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {paginatedLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No logs found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedLogs.length)} of {sortedLogs.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TelemetryLogs;
