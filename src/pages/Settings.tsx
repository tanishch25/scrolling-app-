import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Save, Key, Wallet, Link as LinkIcon, Database, HardDrive, Smartphone, Globe } from 'lucide-react';

export default function Settings() {
  const { profile } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="text-orange-500" size={32} />
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Platform Settings</h1>
      </div>

      {/* System Status Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-zinc-800 p-5 bg-zinc-950 flex items-center gap-3">
          <Database className="text-zinc-400" size={18} />
          <h2 className="text-base font-semibold text-white">System Status & Integrations</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-md">
                <Database size={20} className="text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Supabase Database</p>
                <p className="text-xs text-zinc-500 mt-0.5">Connected & Syncing</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">Active</span>
          </div>

          <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/80 flex items-center justify-between opacity-60 grayscale">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-md">
                <Wallet size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Stripe Payment Gateway</p>
                <p className="text-xs text-zinc-500 mt-0.5">Not configured yet</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-full">Offline</span>
          </div>

          <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/80 flex items-center justify-between opacity-60 grayscale">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-md">
                <Smartphone size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">In-App Purchases (RevenueCat)</p>
                <p className="text-xs text-zinc-500 mt-0.5">Awaiting App Store Setup</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-full">Offline</span>
          </div>

          <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-md">
                <HardDrive size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Edge CDN Storage</p>
                <p className="text-xs text-zinc-500 mt-0.5">Storage capacity at 42%</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">Active</span>
          </div>
        </div>
      </div>

      {/* Admin Profile Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-zinc-800 p-5 bg-zinc-950 flex items-center gap-3">
          <Key className="text-zinc-400" size={18} />
          <h2 className="text-base font-semibold text-white">My Admin Access</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full border border-orange-500/50 overflow-hidden flex items-center justify-center shadow-inner">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-zinc-400">
                  {profile?.display_name ? profile.display_name[0].toUpperCase() : 'A'}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{profile?.display_name || 'Administrator'}</p>
              <p className="text-orange-500 text-xs font-semibold uppercase tracking-wider mt-1">{profile?.role}</p>
            </div>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-4">
            <p className="text-sm text-zinc-400 leading-relaxed">
              You are currently logged into an admin account. Your changes are immediately synchronized across the entire platform, bypassing standard validation layers. Use caution when modifying live series data.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-6 opacity-70">
        <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wider">INCKK ADMIN CENTER V2.0 • ALL SYSTEMS NORMAL</p>
      </div>
    </div>
  );
}
