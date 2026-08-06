import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenTool } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { session, isAdmin, loading: authLoading } = useAuth();

  if (authLoading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading...</div>;

  if (session && isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 border border-zinc-800 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <PenTool size={32} className="text-orange-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Ink Command Center</h1>
          <p className="text-zinc-500 mt-2">Admin Dashboard Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 backdrop-blur-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}
          
          {session && !isAdmin && (
            <div className="bg-orange-500/10 border border-orange-500/50 text-orange-400 p-3 rounded-lg text-sm mb-6">
              You are logged in, but you don't have Admin privileges.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="admin@ink.app"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 text-white font-bold tracking-widest uppercase py-4 rounded-lg mt-4 transition-all disabled:opacity-50 border-t border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              {loading ? 'Authenticating...' : 'Authorize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
