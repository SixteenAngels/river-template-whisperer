
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Map from "./pages/Map";
import Settings from "./pages/Settings";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import { WebSocketProvider } from "./providers/WebSocketProvider";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // WebSocket configuration for Django backend
  // Update these URLs to match your Django server
  const wsConfig = {
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/sensors/',
    protocols: [],
    reconnectAttempts: 5,
    reconnectInterval: 3000
  };

  console.log('Connecting to WebSocket at:', wsConfig.url);

  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider config={wsConfig}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen />}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<Map />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
};

export default App;
