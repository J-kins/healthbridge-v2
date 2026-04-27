import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/shared/Icon';

const PatientLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-neutral-200">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-purple flex items-center justify-center">
              <span className="text-white font-bold">+</span>
            </div>
            {sidebarOpen && <span className="font-bold text-lg">HealthBridge</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/patient/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700"
          >
            <Icon name="chart-bar" size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/patient/appointments"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700"
          >
            <Icon name="calendar" size={20} />
            {sidebarOpen && <span>Appointments</span>}
          </Link>
          <Link
            to="/patient/saved-clinics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700"
          >
            <Icon name="heart" size={20} />
            {sidebarOpen && <span>Saved Clinics</span>}
          </Link>
          <Link
            to="/patient/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700"
          >
            <Icon name="user" size={20} />
            {sidebarOpen && <span>Profile</span>}
          </Link>
        </nav>

        {/* User Section */}
        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-bold">
              {user?.first_name?.charAt(0) || 'P'}
            </div>
            {sidebarOpen && (
              <div className="text-sm">
                <p className="font-semibold text-neutral-900">{user?.first_name || 'Patient'}</p>
                <p className="text-neutral-500 text-xs">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-700"
          >
            <span className="flex items-center justify-center gap-2">
              <Icon name="logout" size={18} />
              {sidebarOpen && 'Logout'}
            </span>
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-12 border-t border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold text-neutral-900">Patient Portal</h1>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center">
              <Icon name="bell" size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;
