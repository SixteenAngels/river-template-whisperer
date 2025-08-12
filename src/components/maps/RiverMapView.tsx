import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Navigation, Zap } from 'lucide-react';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';
import { riverPathCoordinates } from './RiverPath';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

// Mapbox implementation with enhanced features
const MapboxMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
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

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiZG9uZnJhcyIsImEiOiJjbWU4ZXozZG4wZmR5MmpzaHM2dWlsNTVsIn0.CiZaQV8p-Rmm8bpWJ39TsA';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-74.006, 40.7128], // NYC coordinates
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-left'
    );

    // Cleanup on unmount
    return () => {
      if (map.current) {
        markersRef.current.forEach(marker => marker.remove());
        map.current.remove();
      }
    };
  }, []);

  // Add river path
  useEffect(() => {
    if (!map.current) return;

    map.current.on('load', () => {
      if (showRiverPath) {
        if (map.current?.getSource('river-path')) {
          map.current.removeLayer('river-path');
          map.current.removeSource('river-path');
        }

        map.current?.addSource('river-path', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: riverPathCoordinates.map(coord => [coord.lng, coord.lat])
            }
          }
        });

        map.current?.addLayer({
          id: 'river-path',
          type: 'line',
          source: 'river-path',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#60a5fa',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      }
    });
  }, [showRiverPath]);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

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

      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.cssText = `
        background: ${getStatusColor(station.status)};
        width: 20px;
        height: 20px;
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true
      }).setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-sm mb-2">${station.name}</h3>
          <div class="space-y-1 text-xs">
            <div>Status: <span class="font-medium">${station.status}</span></div>
            <div>pH: <span class="font-medium">${station.data?.pH.toFixed(1)}</span></div>
            <div>Temperature: <span class="font-medium">${station.data?.temperature.toFixed(1)}°C</span></div>
            <div>Turbidity: <span class="font-medium">${station.data?.turbidity.toFixed(1)} NTU</span></div>
            <div>Dissolved O₂: <span class="font-medium">${station.data?.dissolvedOxygen.toFixed(1)} mg/L</span></div>
            ${isConnected && sensorData.length > 0 ? '<div class="text-green-600 font-medium">● Live Data</div>' : ''}
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.position.lng, station.position.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
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

// Mapbox River Map View
const RiverMapView: React.FC = () => {
  return <MapboxMap />;
};

export default RiverMapView;