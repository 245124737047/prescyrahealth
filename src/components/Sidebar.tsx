import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Pill,
  Search,
  AlertTriangle,
  Bell,
  User,
  LogOut,
  X,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { t } = useLanguage();
  const { logout, user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'dashboard' },
    { path: '/medications', icon: Pill, label: 'medications' },
    { path: '/drug-info', icon: Search, label: 'drugInfo' },
    { path: '/interactions', icon: AlertTriangle, label: 'interactions' },
    { path: '/reminders', icon: Bell, label: 'reminders' },
    { path: '/profile', icon: User, label: 'profile' },
    { path: '/demo-profiles', icon: Users, label: 'demoProfiles' },
    { path: '/feedback', icon: MessageSquare, label: 'feedback' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 min-h-screen max-h-screen w-64 bg-card border-r border-border transition-transform duration-300 flex flex-col overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Branding */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center">
              <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
                Prescyra
              </h1>
            </Link>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onToggle}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-secondary mt-3 rounded-full" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onToggle()}
                className={cn(
                  'nav-link',
                  isActive && 'active'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{t(item.label)}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-border">
          {user && (
            <div className="mb-3 px-4 py-2">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.name || user.user_metadata?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="nav-link w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
