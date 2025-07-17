
import React, { useState } from 'react';
import { Droplets, Bell, User, BarChart3, Map, AlertCircle, Settings, Menu, X, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarTrigger } from './ui/sidebar';
import { Badge } from './ui/badge';

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/devices')) return 'Devices';
    if (path === '/logs') return 'Telemetry Logs';
    if (path === '/map') return 'Map View';
    if (path === '/add-device') return 'Add Device';
    if (path === '/settings') return 'Settings';
    return 'River Watcher';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="lg:hidden" />
        
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-river-blue-light animate-flow" />
          <span className="text-xl font-semibold text-white">{getPageTitle(currentPath)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-river-danger text-white" variant="destructive">
              {notificationCount}
            </Badge>
          )}
        </Button>
        
        <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1 pl-3">
          <span className="text-sm font-medium hidden sm:inline">John Doe</span>
          <div className="h-8 w-8 rounded-full bg-river-purple-light/20 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
