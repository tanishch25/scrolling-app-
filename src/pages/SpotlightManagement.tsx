import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plus, ListVideo, Trash2 } from 'lucide-react';
import type { Database } from '../lib/database';

type Spotlight = Database['public']['Tables']['spotlight']['Row'];
type Series = Database['public']['Tables']['series']['Row'];

export default function SpotlightManagement() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpotlight, setNewSpotlight] = useState({ series_id: '', video_url: '', caption: '' });

  const { data: spotlightItems, isLoading } = useQuery({
    queryKey: ['admin_spotlight'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlight')
        .select(`*, series(title)`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    }
  });

  const { data: series } = useQuery({
    queryKey: ['admin_series_basic'],
    queryFn: async () => {
      const { data, error } = await supabase.from('series').select('id, title').is('deleted_at', null);
      if (error) throw error;
      return data as Pick<Series, 'id' | 'title'>[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newS: Partial<Spotlight>) => {
      const { data, error } = await supabase.from('spotlight').insert([newS]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_spotlight'] });
      setIsModalOpen(false);
      setNewSpotlight({ series_id: '', video_url: '', caption: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('spotlight').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_spotlight'] });
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      series_id: newSpotlight.series_id,
      video_url: newSpotlight.video_url,
      caption: newSpotlight.caption,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ListVideo className="text-orange-500" size={32} />
          <h1 className="text-3xl font-black tracking-tighter text-white">Spotlight Feed</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Vertical Video
        </button>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-10">Loading spotlight feed...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlightItems?.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-[9/16] bg-zinc-950 relative">
                <video 
                  src={item.video_url} 
                  className="w-full h-full object-cover opacity-70"
                  muted 
                  loop 
                  autoPlay
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => {
                      if(confirm('Delete this spotlight video?')) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center backdrop-blur hover:bg-red-500/40 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.series?.title || 'Standalone'}</p>
                <p className="text-white text-sm line-clamp-3">{item.caption}</p>
                <div className="mt-4 flex gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <span>{item.views || 0} Views</span>
                  <span>{item.likes || 0} Likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add Spotlight Video</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Linked Series</label>
                <select 
                  required
                  value={newSpotlight.series_id}
                  onChange={e => setNewSpotlight({...newSpotlight, series_id: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select a Series</option>
                  {series?.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Video CDN URL (Vertical 9:16)</label>
                <input required type="url" placeholder="https://..." value={newSpotlight.video_url} onChange={e => setNewSpotlight({...newSpotlight, video_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Caption</label>
                <textarea rows={3} value={newSpotlight.caption} onChange={e => setNewSpotlight({...newSpotlight, caption: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs disabled:opacity-50">
                  {createMutation.isPending ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
