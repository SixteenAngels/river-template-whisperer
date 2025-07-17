
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Droplet, Zap, Battery, Thermometer, Flask, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';

// Mock data for the charts
const last24HoursData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  pH: 6.5 + Math.random(),
  turbidity: 10 + Math.random() * 5,
  conductivity: 250 + Math.random() * 50,
  ise: 0.25 + Math.random() * 0.1,
  mercury: 0.005 + Math.random() * 0.01,
}));

const recentActivity = [
  { id: 'RW-001', event: 'Low battery alert', time: '10 mins ago', status: 'warning' },
  { id: 'RW-003', event: 'High pH detected', time: '25 mins ago', status: 'danger' },
  { id: 'RW-007', event: 'Device reconnected', time: '1 hour ago', status: 'success' },
  { id: 'RW-005', event: 'Data sync completed', time: '2 hours ago', status: 'success' },
  { id: 'RW-002', event: 'Configuration updated', time: '3 hours ago', status: 'info' },
];

const MetricCard = ({ title, value, unit, icon: Icon, trend, color }: any) => (
  <Card className="river-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}<span className="text-sm ml-1">{unit}</span></div>
      <p className={`text-xs text-${trend === 'up' ? 'river-success' : trend === 'down' ? 'river-danger' : 'muted-foreground'} mt-1`}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{Math.abs(Math.random() * 5).toFixed(1)}% from average
      </p>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { isConnected, sensorData, deviceStatuses } = useDjangoWebSocket();

  // Calculate averages across devices (would normally come from API)
  const averages = {
    pH: 6.82,
    turbidity: 12.1,
    conductivity: 280,
    ise: 0.29,
    mercury: 0.011,
    battery: 3.9
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-river-success' : 'bg-river-danger'}`}></div>
          <span className="text-sm text-muted-foreground">{isConnected ? 'Live Data' : 'Offline'}</span>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="pH Level"
          value={averages.pH}
          unit=""
          icon={Droplet}
          trend="up"
          color="river-blue-light"
        />
        <MetricCard
          title="Turbidity"
          value={averages.turbidity}
          unit="NTU"
          icon={Activity}
          trend="down"
          color="river-purple-light"
        />
        <MetricCard
          title="Conductivity"
          value={averages.conductivity}
          unit="μS/cm"
          icon={Zap}
          trend="stable"
          color="river-success"
        />
        <MetricCard
          title="ISE Value"
          value={averages.ise}
          unit="mV"
          icon={Flask}
          trend="up"
          color="river-warning"
        />
        <MetricCard
          title="Mercury"
          value={averages.mercury}
          unit="ppb"
          icon={AlertTriangle}
          trend="down"
          color="river-danger"
        />
        <MetricCard
          title="Battery"
          value={averages.battery}
          unit="V"
          icon={Battery}
          trend="down"
          color="river-blue"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="river-card">
          <CardHeader>
            <CardTitle>pH & Turbidity (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={last24HoursData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#33C3F0" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" stroke="#33C3F0" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9b87f5" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="pH" 
                    stroke="#33C3F0" 
                    fillOpacity={1} 
                    fill="url(#colorPh)" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="turbidity" 
                    stroke="#9b87f5" 
                    fillOpacity={1} 
                    fill="url(#colorTurbidity)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="river-card">
          <CardHeader>
            <CardTitle>Conductivity & ISE (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={last24HoursData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="conductivity" fill="#4CAF50" name="Conductivity" />
                  <Bar yAxisId="right" dataKey="ise" fill="#FFC107" name="ISE Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="river-card">
        <CardHeader>
          <CardTitle>Recent Device Activity</CardTitle>
          <CardDescription>Latest events from your monitoring devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between border-b border-secondary/30 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full bg-river-${
                    activity.status === 'success' ? 'success' : 
                    activity.status === 'warning' ? 'warning' : 
                    activity.status === 'danger' ? 'danger' : 
                    'blue-light'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.id}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View All Activity</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
