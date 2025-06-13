import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Layers, Navigation, Zap } from 'lucide-react';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';
import MapInfoWindow from './MapInfoWindow';
import MarkerIcon from './MarkerIcon';
import { riverPathCoordinates } from './RiverPath';

// Enhanced monitoring stations with custom descriptive names
const stations = [
  { 
    id: 1, 
    name: 'Brooklyn Bridge Water Monitor', 
    position: { lat: 40.712776, lng: -74.005974 }, 
    status: 'normal' as const,
    data: {
      pH: 7.2,
      temperature: 18.5,
      turbidity: 2.1,
      dissolvedOxygen: 8.5,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 2, 
    name: 'Manhattan Financial District Sensor', 
    position: { lat: 40.730610, lng: -73.985242 }, 
    status: 'normal' as const,
    data: {
      pH: 7.0,
      temperature: 19.2,
      turbidity: 1.8,
      dissolvedOxygen: 8.8,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 3, 
    name: 'Central Park South Quality Station', 
    position: { lat: 40.758896, lng: -73.985130 }, 
    status: 'warning' as const,
    data: {
      pH: 6.5,
      temperature: 22.1,
      turbidity: 4.2,
      dissolvedOxygen: 6.2,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 4, 
    name: 'Times Square Environmental Monitor', 
    position: { lat: 40.748817, lng: -73.985428 }, 
    status: 'normal' as const,
    data: {
      pH: 7.1,
      temperature: 18.8,
      turbidity: 2.0,
      dissolvedOxygen: 8.2,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 5, 
    name: 'Hudson River Industrial Sensor', 
    position: { lat: 40.712811, lng: -74.013083 }, 
    status: 'danger' as const,
    data: {
      pH: 5.8,
      temperature: 25.3,
      turbidity: 8.5,
      dissolvedOxygen: 4.1,
      lastUpdate: new Date().toISOString()
    }
  },
];

// Mock Google Maps implementation with enhanced features
const MockGoogleMap = () => {
  const { sensorData, isConnected } = useDjangoWebSocket();
  const [selectedStation, setSelectedStation] = useState<typeof stations[0] | null>(null);
  const [showClustering, setShowClustering] = useState(true);
  const [showRiverPath, setShowRiverPath] = useState(true);
  const [realTimeStations, setRealTimeStations] = useState(stations);

  // Update stations with real-time data from WebSocket
  useEffect(() => {
    if (sensorData.length > 0) {
      const latestData = sensorData[sensorData.length - 1];
      setRealTimeStations(prev => 
        prev.map(station => {
          if (station.name.toLowerCase().includes(latestData.stationId.toLowerCase())) {
            return {
              ...station,
              data: {
                pH: latestData.pH,
                temperature: latestData.temperature,
                turbidity: latestData.turbidity,
                dissolvedOxygen: latestData.dissolvedOxygen,
                lastUpdate: latestData.timestamp
              },
              status: latestData.pH < 6 || latestData.pH > 8.5 ? 'danger' : 
                     latestData.turbidity > 5 ? 'warning' : 'normal'
            };
          }
          return station;
        })
      );
    }
  }, [sensorData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-river-success';
      case 'warning': return 'bg-river-warning';
      case 'danger': return 'bg-river-danger';
      default: return 'bg-river-blue-light';
    }
  };

  const handleStationClick = (station: typeof stations[0]) => {
    setSelectedStation(station);
  };

  const clusteredStations = showClustering ? 
    realTimeStations.reduce((clusters: any[], station) => {
      const cluster = clusters.find(c => 
        Math.abs(c.position.lat - station.position.lat) < 0.01 &&
        Math.abs(c.position.lng - station.position.lng) < 0.01
      );
      
      if (cluster) {
        cluster.stations.push(station);
        cluster.count = cluster.stations.length;
      } else {
        clusters.push({
          position: station.position,
          stations: [station],
          count: 1
        });
      }
      return clusters;
    }, []) : realTimeStations.map(s => ({ position: s.position, stations: [s], count: 1 }));

  return (
    <div className="relative h-full w-full bg-secondary/30 overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <Card className="river-card p-2">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowRiverPath(!showRiverPath)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
                showRiverPath ? 'bg-river-blue-light text-white' : 'hover:bg-secondary'
              }`}
            >
              <Navigation className="h-4 w-4" />
              River Path
            </button>
            <button
              onClick={() => setShowClustering(!showClustering)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
                showClustering ? 'bg-river-purple-light text-white' : 'hover:bg-secondary'
              }`}
            >
              <Layers className="h-4 w-4" />
              Clustering
            </button>
          </div>
        </Card>
        
        {/* Connection Status */}
        <Card className="river-card p-2">
          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${isConnected ? 'text-river-success' : 'text-river-danger'}`} />
            <span className="text-xs">
              {isConnected ? 'Live Data' : 'Offline'}
            </span>
          </div>
        </Card>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-10 w-10 text-river-purple-light mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Enhanced Map Features</h3>
          <p className="text-muted-foreground mb-4">
            Interactive map with custom named stations, InfoWindows, real-time updates, river paths, and clustering.
          </p>
          <div className="river-card p-4 text-xs font-mono bg-background/50 text-left overflow-x-auto">
            <code>
              ✓ Custom station names for each device<br />
              ✓ Custom marker icons with status colors<br />
              ✓ InfoWindows with detailed station data<br />
              ✓ Real-time WebSocket data integration<br />
              ✓ River path visualization<br />
              ✓ Marker clustering toggle<br />
              ✓ Interactive controls
            </code>
          </div>
        </div>
      </div>
      
      {/* River Path Visualization */}
      {showRiverPath && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d={riverPathCoordinates.map((coord, index) => {
              const x = (coord.lng + 74.1) * 1000 + 100;
              const y = (41 - coord.lat) * 1000 + 100;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke="#60a5fa"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
            className="animate-pulse"
            opacity="0.7"
          />
        </svg>
      )}
      
      {/* Enhanced Station Markers */}
      {clusteredStations.map((cluster, index) => {
        const randX = 30 + Math.random() * 40;
        const randY = 30 + Math.random() * 40;
        const station = cluster.stations[0];
        
        return (
          <div key={index}>
            <div 
              className="absolute group cursor-pointer transform transition-transform hover:scale-110"
              style={{ left: `${randX}%`, top: `${randY}%` }}
              onClick={() => handleStationClick(station)}
            >
              {cluster.count > 1 ? (
                <div className="relative">
                  <div className={`h-8 w-8 rounded-full ${getStatusColor(station.status)} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                    {cluster.count}
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-river-blue-light rounded-full animate-ping"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <MarkerIcon status={station.status} isActive={selectedStation?.id === station.id} />
                </div>
              )}
              
              {/* Enhanced Tooltip */}
              <div className="invisible group-hover:visible absolute z-10 -top-16 left-1/2 -translate-x-1/2 p-2 bg-background/95 rounded border border-secondary/50 whitespace-nowrap shadow-lg">
                <div className="text-xs font-medium">{station.name}</div>
                <div className="text-xs text-muted-foreground">
                  Status: {station.status} | pH: {station.data?.pH.toFixed(1)}
                </div>
                {isConnected && sensorData.length > 0 && (
                  <div className="text-xs text-river-success">● Live</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* InfoWindow */}
      {selectedStation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <MapInfoWindow 
            station={selectedStation} 
            onClose={() => setSelectedStation(null)}
          />
        </div>
      )}
      
      {/* Grid overlay for aesthetics */}
      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-river-blue/5"></div>
        ))}
      </div>
    </div>
  );
};

// Real Google Maps implementation (commented out for now)
const RiverMapView: React.FC = () => {
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  
  // This function would integrate the actual Google Maps API
  const loadGoogleMaps = () => {
    // Uncomment this code and replace YOUR_API_KEY when ready to use actual Google Maps
    /*
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,visualization&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
    }
    */
    
    // For development, we'll just use our enhanced mock
    setGoogleMapsLoaded(true);
  };
  
  useEffect(() => {
    loadGoogleMaps();
  }, []);
  
  // For now, return the enhanced mock implementation
  return <MockGoogleMap />;
};

export default RiverMapView;
