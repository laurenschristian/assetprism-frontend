import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  LayoutDashboard, 
  HardDrive, 
  Monitor, 
  Users, 
  BarChart3, 
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Hardware Assets', href: '/assets', icon: HardDrive },
  { name: 'Software', href: '/software', icon: Monitor },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const NavigationItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href;
    
    const linkContent = (
      <Link
        to={item.href}
        className={cn(
          'group flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200',
          'hover:bg-gray-50 hover:text-gray-900',
          isActive
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'text-gray-700',
          isCollapsed && 'justify-center px-2'
        )}
      >
        <item.icon
          className={cn(
            'h-5 w-5 shrink-0 transition-colors',
            isActive 
              ? 'text-blue-600' 
              : 'text-gray-500 group-hover:text-gray-700'
          )}
        />
        {!isCollapsed && (
          <span className="truncate">{item.name}</span>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header with toggle */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AssetPrism</span>
            </div>
          )}
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Building2 className="h-8 w-8 text-blue-600 mx-auto cursor-default" />
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>AssetPrism</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col p-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavigationItem item={item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          {!isCollapsed && (
            <>
              <div className="mb-3">
                <p className="text-sm text-gray-700 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                AssetPrism v1.0.0
              </p>
            </>
          )}
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full h-8 p-0 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
} 