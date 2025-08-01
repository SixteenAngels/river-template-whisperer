
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Map from "./pages/Map";
import Settings from "./pages/Settings";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import SensorDashboardPage from "./pages/SensorDashboard";
import WebSocketTestPage from "./pages/WebSocketTest";
import { WebSocketProvider } from "./providers/WebSocketProvider";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import DeviceDetail from "./pages/DeviceDetail";
import TelemetryLogs from "./pages/TelemetryLogs";
import MapView from "./pages/MapView";
import AddDevice from "./pages/AddDevice";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

// Define routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/auth'];

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication (demo only - would be more robust in production)
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // WebSocket configuration for Django backend
  const wsConfig = {
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/sensors/',
    protocols: [],
    reconnectAttempts: 10,
    reconnectInterval: 5000
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider config={wsConfig}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen />}
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="devices" element={<Devices />} />
                <Route path="devices/:deviceId" element={<DeviceDetail />} />
                <Route path="logs" element={<TelemetryLogs />} />
                <Route path="map" element={<MapView />} />
                <Route path="add-device" element={<AddDevice />} />
                <Route path="sensors" element={<SensorDashboardPage />} />
                <Route path="websocket-test" element={<WebSocketTestPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="alerts" element={<Alerts />} />
              </Route>
              
              {/* Legacy routes */}
              <Route path="/original-dashboard" element={<Index />} />
              <Route path="/original-map" element={<Map />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
};

export default App;
