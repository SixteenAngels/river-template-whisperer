
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

  // WebSocket configuration - update this URL to match your Django backend
  const wsConfig = {
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/sensors/',
    protocols: [],
    reconnectAttempts: 5,
    reconnectInterval: 3000
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
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<Map />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/alerts" element={<Alerts />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
};

export default App;
