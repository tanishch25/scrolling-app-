import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenTool, Film, ListVideo, Settings, LogOut, PlayCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DashboardLayout() {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading...</div>;

  if (!session || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Series', path: '/dashboard', icon: Film },
    { name: 'Episodes', path: '/dashboard/episodes', icon: PlayCircle },
    { name: 'Spotlight', path: '/dashboard/spotlight', icon: ListVideo },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
            <PenTool size={20} className="text-orange-500" />
          </div>
          <span className="text-xl font-black tracking-tighter">INK ADMIN</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold tracking-wide uppercase text-xs transition-colors ${
                  isActive 
                    ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-bold tracking-wide uppercase text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur flex items-center px-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h2>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
