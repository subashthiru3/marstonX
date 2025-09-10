import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Car,
  Users,
  TriangleAlert,
  Plus,
  ClipboardList,
  User as UserIcon,
  LogOut,
  Menu,
  Bell,
  Settings,
  X,
} from 'lucide-react';
import { Sidebar, Menu as ProSidebarMenu, MenuItem } from 'react-pro-sidebar';
// import NotificationPanel from './NotificationPanel';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = user?.role === 'admin' ? [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/admin/vehicles', icon: Car },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Incidents', path: '/admin/incidents', icon: TriangleAlert },
    { name: 'Analytics', path: '/admin/analytics', icon: LayoutDashboard },
  ] : [
    { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'New Incident', path: '/user/new-incident', icon: Plus },
    { name: 'My Incidents', path: '/user/incidents', icon: ClipboardList },
    { name: 'Profile', path: '/user/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar using react-pro-sidebar */}
      <div className="h-screen sticky top-0 z-40 flex-none">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          width="280px" 
          collapsedWidth="80px"
          backgroundColor="#ffffff" 
          className="shadow-md" 
          rootStyles={{ height: '100vh' }}
        >
          <div className="flex flex-col h-full">
            <div>
              <div className="flex items-center h-16 px-5 bg-blue-600">
                <div className="flex items-center text-white">
                  <div className="w-9 h-9 bg-white/20 rounded-md mr-3 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <h1 className="text-lg font-semibold tracking-tight">Fleet Incident</h1>
                  )}
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="ml-auto text-white/80 hover:text-white p-1 rounded"
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
              <ProSidebarMenu>
                {navigationItems.map((item) => (
                  <MenuItem key={item.path} active={location.pathname === item.path} icon={<item.icon className="h-5 w-5" />}
                    component={<Link to={item.path} />}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </ProSidebarMenu>
            </div>
            <div className="mt-auto px-4 py-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                {!sidebarCollapsed && (
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                )}
              </div>
              <button 
                onClick={handleLogout} 
                className={`w-full inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title={sidebarCollapsed ? 'Logout' : ''}
              >
                <LogOut className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} /> 
                {!sidebarCollapsed && 'Logout'}
              </button>
            </div>
          </div>
        </Sidebar>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top navigation */}
        <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40 border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {navigationItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <span>Welcome, {user?.name}</span>
              </div>
              
              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge - you can add logic to show unread count */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile Settings Button */}
              <button
                onClick={() => navigate(user?.role === 'admin' ? '/admin/profile' : '/user/profile')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Profile Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16 px-5 bg-blue-600">
                <div className="flex items-center text-white">
                  <div className="w-9 h-9 bg-white/20 rounded-md mr-3 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <h1 className="text-lg font-semibold tracking-tight">Fleet Incident</h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-auto text-white/80 hover:text-white p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-4 space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.path
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="px-4 py-4 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="mr-2 h-4 w-4" /> 
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      {/* <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      /> */}
    </div>
  );
};

export default DashboardLayout;
