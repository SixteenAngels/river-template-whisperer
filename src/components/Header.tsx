
import React from 'react';
import { Droplets, BarChart3, Map, AlertCircle, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background/80 px-4 backdrop-blur-sm lg:px-8">
      <div className="flex items-center gap-2">
        <Droplets className="h-6 w-6 text-river-blue-light animate-flow" />
        <span className="text-xl font-semibold text-white">RiverWatcher</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-1">
        <NavLink to="/" active={currentPath === '/'}>
          <BarChart3 className="h-4 w-4 mr-2" />
          dashboard
        </NavLink>
        <NavLink to="/map" active={currentPath === '/map'}>
          <Map className="h-4 w-4 mr-2" />
          Map View
        </NavLink>
        <NavLink to="/alerts" active={currentPath === '/alerts'}>
          <AlertCircle className="h-4 w-4 mr-2" />
          Alerts
        </NavLink>
        <NavLink to="/settings" active={currentPath === '/settings'}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </NavLink>
      </nav>
      
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-river-purple/30 p-1.5 text-river-purple-light">
          <Droplets className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ children, to, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium rounded-md",
        active
          ? "text-river-purple-light bg-secondary"
          : "text-muted-foreground hover:text-river-foreground hover:bg-secondary/50"
      )}
    >
      {children}
    </Link>
  );
};

export default Header;
