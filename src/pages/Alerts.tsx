
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, alertsData } from '@/types/alerts';
import AlertSummary from '@/components/alerts/AlertSummary';
import AlertBanner from '@/components/alerts/AlertBanner';
import AlertTable from '@/components/alerts/AlertTable';

const Alerts: React.FC = () => {
  const [alertsList, setAlertsList] = useState<Alert[]>(alertsData);
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
          
          {/* Summary Cards */}
          <AlertSummary alerts={alertsList} />
          
          {/* Critical Alert Banner */}
          <AlertBanner alerts={alertsList} />
          
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
                  <AlertTable 
                    alerts={filteredAlerts}
                    onAcknowledge={acknowledgeAlert}
                    formatDate={formatDate}
                  />
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
