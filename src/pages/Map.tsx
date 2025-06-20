
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, MapPin, Navigation } from 'lucide-react';
import RiverMapView from '@/components/maps/RiverMapView';

const Map = () => {
  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-3/4">
            <Card className="river-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-river-purple-light" />
                  River Monitoring Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <RiverMapView />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-1/4 space-y-4">
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
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {['Station Alpha', 'Station Beta', 'Station Gamma', 'Station Delta', 'Station Epsilon'].map((station, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 cursor-pointer">
                      <span className="text-sm">{station}</span>
                      <div className={`h-2 w-2 rounded-full ${index === 4 ? 'bg-river-danger' : index === 2 ? 'bg-river-warning' : 'bg-river-success'}`}></div>
                    </div>
                  ))}
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
