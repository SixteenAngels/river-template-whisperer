import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Navigation, Zap } from 'lucide-react';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';
import { riverPathCoordinates } from './RiverPath';
import { Loader } from '@googlemaps/js-api-loader';

// KNUST Library area monitoring stations
const stations = [
  { 
    id: 1, 
    name: 'KNUST Library Main Entrance', 
    position: { lat: 6.6745, lng: -1.5716 }, 
    status: 'normal' as const,
    data: {
      pH: 7.2,
      temperature: 28.5,
      turbidity: 2.1,
      dissolvedOxygen: 8.5,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 2, 
    name: 'Central Administration Block', 
    position: { lat: 6.6758, lng: -1.5720 }, 
    status: 'normal' as const,
    data: {
      pH: 7.0,
      temperature: 29.2,
      turbidity: 1.8,
      dissolvedOxygen: 8.8,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 3, 
    name: 'Engineering Block Water Quality', 
    position: { lat: 6.6730, lng: -1.5700 }, 
    status: 'warning' as const,
    data: {
      pH: 6.5,
      temperature: 32.1,
      turbidity: 4.2,
      dissolvedOxygen: 6.2,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 4, 
    name: 'Student Residence Area', 
    position: { lat: 6.6765, lng: -1.5735 }, 
    status: 'normal' as const,
    data: {
      pH: 7.1,
      temperature: 28.8,
      turbidity: 2.0,
      dissolvedOxygen: 8.2,
      lastUpdate: new Date().toISOString()
    }
  },
  { 
    id: 5, 
    name: 'Sports Complex Water Monitor', 
    position: { lat: 6.6720, lng: -1.5680 }, 
    status: 'danger' as const,
    data: {
      pH: 5.8,
      temperature: 35.3,
      turbidity: 8.5,
      dissolvedOxygen: 4.1,
      lastUpdate: new Date().toISOString()
    }
  },
];

// Google Maps implementation with enhanced features
const GoogleMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const riverPath = useRef<google.maps.Polyline | null>(null);
  const infoWindows = useRef<google.maps.InfoWindow[]>([]);
  const { sensorData, isConnected } = useDjangoWebSocket();
  const [showRiverPath, setShowRiverPath] = useState(true);
  const [realTimeStations, setRealTimeStations] = useState(stations);

  // Update stations with real-time data from WebSocket
  useEffect(() => {
    if (sensorData.length > 0) {
      const latestData = sensorData[sensorData.length - 1];
      setRealTimeStations(prev => 
        prev.map(station => {
          if (station.name.toLowerCase().includes(latestData.stationId?.toLowerCase() || '')) {
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

  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainer.current) return;

    const loader = new Loader({
      apiKey: 'AIzaSyC4slId_coCqTJDDDRyhjkDgHtIlOWNojU',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      map.current = new google.maps.Map(mapContainer.current!, {
        center: { lat: 6.6745, lng: -1.5716 }, // KNUST coordinates
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        tilt: 45,
        heading: 17.6,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });
    });

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindows.current.forEach(infoWindow => infoWindow.close());
      if (riverPath.current) riverPath.current.setMap(null);
    };
  }, []);

  // Add river path
  useEffect(() => {
    if (!map.current) return;

    if (showRiverPath) {
      if (riverPath.current) {
        riverPath.current.setMap(null);
      }

      riverPath.current = new google.maps.Polyline({
        path: riverPathCoordinates.map(coord => ({ lat: coord.lat, lng: coord.lng })),
        geodesic: true,
        strokeColor: '#60a5fa',
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });

      riverPath.current.setMap(map.current);
    } else {
      if (riverPath.current) {
        riverPath.current.setMap(null);
      }
    }
  }, [showRiverPath, map.current]);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers and info windows
    markersRef.current.forEach(marker => marker.setMap(null));
    infoWindows.current.forEach(infoWindow => infoWindow.close());
    markersRef.current = [];
    infoWindows.current = [];

    // Add new markers
    realTimeStations.forEach((station) => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'normal': return '#10b981';
          case 'warning': return '#f59e0b';
          case 'danger': return '#ef4444';
          default: return '#60a5fa';
        }
      };

      // Create custom marker icon
      const markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: getStatusColor(station.status),
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      };

      // Create info window content
      const infoWindowContent = `
        <div style="padding: 12px; font-family: system-ui; max-width: 250px;">
          <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 8px 0;">${station.name}</h3>
          <div style="font-size: 12px; line-height: 1.4;">
            <div style="margin-bottom: 4px;">Status: <strong>${station.status}</strong></div>
            <div style="margin-bottom: 4px;">pH: <strong>${station.data?.pH.toFixed(1)}</strong></div>
            <div style="margin-bottom: 4px;">Temperature: <strong>${station.data?.temperature.toFixed(1)}°C</strong></div>
            <div style="margin-bottom: 4px;">Turbidity: <strong>${station.data?.turbidity.toFixed(1)} NTU</strong></div>
            <div style="margin-bottom: 4px;">Dissolved O₂: <strong>${station.data?.dissolvedOxygen.toFixed(1)} mg/L</strong></div>
            ${isConnected && sensorData.length > 0 ? '<div style="color: #10b981; font-weight: 500;">● Live Data</div>' : ''}
          </div>
        </div>
      `;

      // Create marker
      const marker = new google.maps.Marker({
        position: { lat: station.position.lat, lng: station.position.lng },
        map: map.current,
        icon: markerIcon,
        title: station.name,
        animation: google.maps.Animation.DROP,
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      // Add click listener
      marker.addListener('click', () => {
        // Close all other info windows
        infoWindows.current.forEach(iw => iw.close());
        infoWindow.open(map.current, marker);
      });

      markersRef.current.push(marker);
      infoWindows.current.push(infoWindow);
    });
  }, [realTimeStations, isConnected, sensorData]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <Card className="river-card p-2">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowRiverPath(!showRiverPath)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                showRiverPath ? 'bg-river-blue-light text-white' : 'hover:bg-secondary'
              }`}
            >
              <Navigation className="h-4 w-4" />
              River Path
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
    </div>
  );
};

// Google Maps River Map View
const RiverMapView: React.FC = () => {
  return <GoogleMap />;
};

export default RiverMapView;