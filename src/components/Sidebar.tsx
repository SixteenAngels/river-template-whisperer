
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  ScrollText, 
  Map, 
  PlusSquare, 
  LogOut, 
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
  Sidebar
} from './ui/sidebar';
import { useNavigate } from 'react-router-dom';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
};

const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  const handleLogout = () => {
    // Handle logout logic here
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // Logic to toggle theme would go here
  };

  const navItems: NavItemProps[] = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/devices', icon: Cpu, label: 'Devices' },
    { to: '/logs', icon: ScrollText, label: 'Telemetry Logs' },
    { to: '/map', icon: Map, label: 'Map View' },
    { to: '/add-device', icon: PlusSquare, label: 'Add Device' },
  ];

  const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink 
            to={to} 
            className={({ isActive }) => 
              `flex items-center ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`
            }
          >
            <Icon className="h-5 w-5 mr-3" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <div className={collapsed ? "w-16" : "w-64"}>
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <span className="text-primary font-bold">RW</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">River Watcher</span>
              <span className="text-xs text-muted-foreground">IoT Monitoring</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator />
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={toggleTheme}
          >
            {darkMode ? (
              <Sun className="h-4 w-4 mr-3" />
            ) : (
              <Moon className="h-4 w-4 mr-3" />
            )}
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </Button>

          <Button
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4 mr-3" />
            {!collapsed && <span>Settings</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </div>
  );
};

export default AppSidebar;
