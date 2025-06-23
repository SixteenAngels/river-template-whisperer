
import React, { useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SensorTable from './SensorTable';
import { useSensorData } from '@/hooks/useSensorData';
import { useSensorWebSocket } from '@/hooks/useSensorWebSocket';

const SensorDashboard: React.FC = () => {
  const { schema, sensors, loading, error, refetch } = useSensorData();
  const { isConnected, lastMessage } = useSensorWebSocket();

  // Handle real-time updates from WebSocket
  useEffect(() => {
    if (lastMessage) {
      console.log('Received real-time sensor update:', lastMessage);
      // In a production app, you'd update the sensors state here
      // For now, we'll just log it and could trigger a refetch
    }
  }, [lastMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading sensor data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sensor Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time sensor data from Django backend
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* WebSocket Status */}
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </div>
          
          {/* Refresh Button */}
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Schema Info */}
      {schema && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Schema Information</h3>
          <p className="text-sm text-muted-foreground">
            Model: <code className="bg-background px-1 rounded">{schema.model}</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Fields: <code className="bg-background px-1 rounded">{schema.fields.join(', ')}</code>
          </p>
        </div>
      )}

      {/* Sensor Data Table */}
      {schema ? (
        <SensorTable schema={schema} sensors={sensors} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Unable to load sensor schema
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {sensors.length} sensor record{sensors.length !== 1 ? 's' : ''}
        {lastMessage && (
          <span className="ml-4">
            Last update: {new Date().toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default SensorDashboard;
