
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Bell, Info, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for alerts
const alerts = [
  {
    id: 1,
    title: 'High Turbidity Detected',
    type: 'warning',
    station: 'Station Gamma',
    timestamp: '2025-04-03T08:23:45',
    description: 'Turbidity levels have exceeded warning threshold of 10 NTU',
    acknowledged: false
  },
  {
    id: 2,
    title: 'Critical pH Level',
    type: 'critical',
    station: 'Station Epsilon',
    timestamp: '2025-04-03T07:14:22',
    description: 'pH levels have fallen below critical threshold of 6.0',
    acknowledged: false
  },
  {
    id: 3,
    title: 'Dissolved Oxygen Warning',
    type: 'warning',
    station: 'Station Beta',
    timestamp: '2025-04-02T22:45:10',
    description: 'Dissolved oxygen levels have dropped below 5mg/L',
    acknowledged: true
  },
  {
    id: 4,
    title: 'System Maintenance',
    type: 'info',
    station: 'All Stations',
    timestamp: '2025-04-01T15:30:00',
    description: 'Scheduled system maintenance will occur on April 10th from 02:00-04:00 UTC',
    acknowledged: true
  },
  {
    id: 5,
    title: 'Critical Flow Rate',
    type: 'critical',
    station: 'Station Alpha',
    timestamp: '2025-04-03T05:12:33',
    description: 'Water flow rate has increased to critical levels of 120 m³/s',
    acknowledged: false
  }
];

// Type for alert objects
type Alert = {
  id: number;
  title: string;
  type: 'info' | 'warning' | 'critical';
  station: string;
  timestamp: string;
  description: string;
  acknowledged: boolean;
};

const Alerts: React.FC = () => {
  const [alertsList, setAlertsList] = useState<Alert[]>(alerts);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get alert type badge
  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'info':
        return <Badge className="bg-river-blue-light hover:bg-river-blue-light">Info</Badge>;
      case 'warning':
        return <Badge className="bg-river-warning hover:bg-river-warning">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-river-danger hover:bg-river-danger">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-river-blue-light" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-river-warning" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-river-danger" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  // Filter alerts based on active tab
  const filteredAlerts = alertsList.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unacknowledged') return !alert.acknowledged;
    return alert.type === activeTab;
  });

  // Acknowledge an alert
  const acknowledgeAlert = (id: number) => {
    setAlertsList(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-2xl font-bold text-river-foreground">Alerts</h1>
          
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="river-card">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <h3 className="text-2xl font-bold text-river-danger">
                    {alertsList.filter(a => a.type === 'critical' && !a.acknowledged).length}
                  </h3>
                </div>
                <div className="rounded-full bg-river-danger/10 p-2 text-river-danger">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="river-card">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">Warning Alerts</p>
                  <h3 className="text-2xl font-bold text-river-warning">
                    {alertsList.filter(a => a.type === 'warning' && !a.acknowledged).length}
                  </h3>
                </div>
                <div className="rounded-full bg-river-warning/10 p-2 text-river-warning">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="river-card">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">Info Notifications</p>
                  <h3 className="text-2xl font-bold text-river-blue-light">
                    {alertsList.filter(a => a.type === 'info' && !a.acknowledged).length}
                  </h3>
                </div>
                <div className="rounded-full bg-river-blue-light/10 p-2 text-river-blue-light">
                  <Bell className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current unacknowledged critical alerts */}
          {alertsList.some(a => a.type === 'critical' && !a.acknowledged) && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Alerts</AlertTitle>
              <AlertDescription>
                There are {alertsList.filter(a => a.type === 'critical' && !a.acknowledged).length} unacknowledged critical alerts that require your attention.
              </AlertDescription>
            </Alert>
          )}
          
          <Card className="river-card">
            <CardHeader className="pb-4">
              <CardTitle>Alert Center</CardTitle>
              <CardDescription>
                View and manage system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-8">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="critical">Critical</TabsTrigger>
                  <TabsTrigger value="warning">Warning</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="unacknowledged">Unacknowledged</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {filteredAlerts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead>Alert</TableHead>
                          <TableHead>Station</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.map((alert) => (
                          <TableRow key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getAlertIcon(alert.type)}
                                {getAlertBadge(alert.type)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{alert.title}</div>
                              <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                            </TableCell>
                            <TableCell>{alert.station}</TableCell>
                            <TableCell>{formatDate(alert.timestamp)}</TableCell>
                            <TableCell className="text-right">
                              {!alert.acknowledged && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => acknowledgeAlert(alert.id)}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Acknowledge
                                </Button>
                              )}
                              {alert.acknowledged && (
                                <span className="text-xs text-muted-foreground">Acknowledged</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No alerts found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        There are no alerts matching your current filter.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
