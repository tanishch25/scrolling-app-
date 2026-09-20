import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Search, Users, Crown, Edit2, ShieldAlert } from 'lucide-react';
import type { Database } from '../lib/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('joined_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as Profile[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedP: Partial<Profile> & { id: string }) => {
      const { data, error } = await supabase.from('profiles').update(updatedP).eq('id', updatedP.id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      setEditingUser(null);
    },
    onError: (error: any) => {
      alert(`Failed to update user: ${error.message}`);
    }
  });

  const filteredUsers = users?.filter(u => 
    (u.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (u.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateMutation.mutate({
      id: editingUser.id,
      is_premium: editingUser.is_premium,
      role: editingUser.role,
      coins: editingUser.coins,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="text-orange-500" size={32} />
          <h1 className="text-3xl font-black tracking-tighter text-white">User Base</h1>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text" 
          placeholder="Search users by name or handle..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-10">Loading users...</div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950 text-xs uppercase font-bold text-zinc-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Coins</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers?.map(user => (
                <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-zinc-600">
                            {(user.display_name || user.username || '?')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{user.display_name || 'Anonymous User'}</div>
                        <div className="text-xs text-zinc-500">@{user.username || 'unknown'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_premium ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20">
                        <Crown size={12} /> Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                        Free Tier
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-red-400' : 'text-zinc-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    {user.coins}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(user.joined_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers?.length === 0 && (
            <div className="text-center py-12 text-zinc-500">No users found.</div>
          )}
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Edit User Access</h2>
              <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              
              <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2"><Crown size={16} className="text-yellow-500"/> Premium Access</h3>
                  <p className="text-xs text-zinc-500 mt-1">Unlock ad-free experience & paid series.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={editingUser.is_premium} 
                  onChange={e => setEditingUser({...editingUser, is_premium: e.target.checked})} 
                  className="w-5 h-5 rounded border-zinc-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-zinc-900 bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Coin Balance</label>
                <input 
                  type="number" 
                  value={editingUser.coins} 
                  onChange={e => setEditingUser({...editingUser, coins: parseInt(e.target.value) || 0})} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-orange-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1"><ShieldAlert size={12}/> Platform Role</label>
                <select 
                  value={editingUser.role}
                  onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="user">Standard User</option>
                  <option value="creator">Creator</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs disabled:opacity-50">
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
