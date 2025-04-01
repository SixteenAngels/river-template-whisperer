
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// Define monitoring stations
const stations = [
  { id: 1, name: 'Station Alpha', position: { lat: 40.712776, lng: -74.005974 }, status: 'normal' },
  { id: 2, name: 'Station Beta', position: { lat: 40.730610, lng: -73.985242 }, status: 'normal' },
  { id: 3, name: 'Station Gamma', position: { lat: 40.758896, lng: -73.985130 }, status: 'warning' },
  { id: 4, name: 'Station Delta', position: { lat: 40.748817, lng: -73.985428 }, status: 'normal' },
  { id: 5, name: 'Station Epsilon', position: { lat: 40.712811, lng: -74.013083 }, status: 'danger' },
];

// Mock Google Maps implementation for development
const MockGoogleMap = () => {
  return (
    <div className="relative h-full w-full bg-secondary/30 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-10 w-10 text-river-purple-light mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
          <p className="text-muted-foreground mb-4">
            This is a development placeholder for Google Maps integration. Add your API key to enable the live map.
          </p>
          <div className="river-card p-4 text-xs font-mono bg-background/50 text-left overflow-x-auto">
            <code>
              1. Get Google Maps API key from Google Cloud Console<br />
              2. Enable Maps JavaScript API<br />
              3. Update the component with your API key
            </code>
          </div>
        </div>
      </div>
      
      {/* Stylized river visualization */}
      <div className="absolute left-1/2 h-full w-[100px] -translate-x-1/2 bg-river-blue/20 animate-pulse"></div>
      
      {/* Mock stations */}
      {stations.map((station) => {
        // Calculate random positions for the development view
        const randX = 30 + Math.random() * 40;
        const randY = 30 + Math.random() * 40;
        
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'normal': return 'bg-river-success';
            case 'warning': return 'bg-river-warning';
            case 'danger': return 'bg-river-danger';
            default: return 'bg-river-blue-light';
          }
        };
        
        return (
          <div 
            key={station.id}
            className="absolute group cursor-pointer"
            style={{ left: `${randX}%`, top: `${randY}%` }}
          >
            <div className={`h-3 w-3 rounded-full ${getStatusColor(station.status)} animate-glow shadow-lg`}></div>
            
            {/* Tooltip */}
            <div className="invisible group-hover:visible absolute z-10 -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-background/90 rounded border border-secondary/50 whitespace-nowrap">
              {station.name}
            </div>
          </div>
        );
      })}
      
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
    }
    */
    
    // For development, we'll just use our mock
    setGoogleMapsLoaded(true);
  };
  
  useEffect(() => {
    loadGoogleMaps();
  }, []);
  
  // For now, return the mock implementation
  return <MockGoogleMap />;
};

export default RiverMapView;
