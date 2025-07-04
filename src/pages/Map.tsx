
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, MapPin, Navigation, Zap } from 'lucide-react';
import RiverMapView from '@/components/maps/RiverMapView';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';

const Map = () => {
  const { isConnected, mapData, sendMessage } = useMapWebSocket();

  const handleTestMessage = () => {
    sendMessage({
      type: 'test',
      message: 'Test message from map page',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="w-full lg:w-3/4">
            <Card className="river-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-river-purple-light" />
                  River Monitoring Map
                  <div className="ml-auto flex items-center gap-2">
                    <Zap className={`h-4 w-4 ${isConnected ? 'text-river-success' : 'text-river-danger'}`} />
                    <span className="text-sm">
                      {isConnected ? 'Live Data' : 'Offline'}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full">
                  <RiverMapView />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-1/4 space-y-4">
            <Card className="river-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-river-blue-light" />
                  Map Legend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-river-success"></div>
                    <span className="text-sm">Normal water quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-river-warning"></div>
                    <span className="text-sm">Warning levels detected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-river-danger"></div>
                    <span className="text-sm">Critical conditions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-river-purple-light" />
                    <span className="text-sm">Monitoring station</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="river-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-river-purple-light" />
                  Active Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto pr-2">
                  {['Station Alpha', 'Station Beta', 'Station Gamma', 'Station Delta', 'Station Epsilon'].map((station, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors">
                      <span className="text-sm">{station}</span>
                      <div className={`h-2 w-2 rounded-full ${index === 4 ? 'bg-river-danger' : index === 2 ? 'bg-river-warning' : 'bg-river-success'}`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="river-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">WebSocket Test</CardTitle>
              </CardHeader>
              <CardContent>
                <button 
                  onClick={handleTestMessage}
                  className="w-full px-3 py-2 bg-river-blue-light text-white rounded text-sm hover:bg-river-blue-light/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isConnected}
                >
                  Send Test Message
                </button>
                <div className="mt-2 text-xs text-muted-foreground">
                  Messages received: {mapData.length}
                </div>
                <div className="mt-1 text-xs">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Map;
